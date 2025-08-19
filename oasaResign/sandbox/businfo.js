const randomString = () => Math.random().toString(36).substring(2, 10);
function capitalizeGreek(text) {
    return text
        .normalize('NFD') // Normalize diacritics (accents)
        .toUpperCase()    // Convert to uppercase
        .normalize('NFC') // Recompose characters
        .replace(/Σ(?=\s|$)/g, 'Σ'); // Optional: Ensure final sigma becomes standard sigma
}

let activeRouteCode = null
function findBusInfo2(id, comego, completeJson, getJustLineCode = false, getJustRouteCode = true) {
    function routeOasa(lineCode) {

        function insider(data) {
            console.log('Route:', data, comego, data[`${comego === "go" ? 0 : 1}`]);
            try {
                if (comego === 'go' || comego === undefined || comego === null) {
                    activeRouteCode = data[0].route_code;
                    if (data && data.length > 0) {
                        return data[0].route_code;
                    } else {
                        throw new Error("Route Code not found. comego=go");
                    }
                } else {
                    const vanilaDesc = data[0].route_descr;
                    console.warn("Tuning starting for:", data);
                    const extraMatch = vanilaDesc.match(/^(.*?)([\(\[].*[\)\]])?$/);
                    if (!extraMatch) throw new Error("Route format not recognized.");

                    let coreRoute = extraMatch[1].trim();
                    let extra = extraMatch[2] || "";

                    // Ensure coreRoute has no trailing extra
                    coreRoute = coreRoute.replace(/[\(\[].*[\)\]]\s*$/, "").trim();

                    // Reverse stops
                    const stops = coreRoute.split(" - ").map(s => s.trim()).reverse();

                    // Append extra to the *last* stop after reversing
                    if (extra) {
                        stops[stops.length - 1] += extra;
                    }

                    const reversed = stops.join(" - ");
                    console.log("Reversed:", reversed);
                    let found = false;
                    for (const route of data) {
                        if (route.route_descr === reversed) {
                            console.warn("VOXNEW FOUND:", route, route.route_descr);
                            activeRouteCode = route.route_code;
                            found = true;
                            return route.route_code;
                        }
                    }
                    if (!found) {
                        for (const route of data) {
                            if (route.route_descr.includes(reversed)) {
                                console.warn("VOXNEW FOUND:", route, route.route_descr);
                                activeRouteCode = route.route_code;
                                found = true;
                                return route.route_code;
                            }
                        }
                        //throw new Error("Route Code not found.");
                    }

                    if (!found) {
                        const newSearch = reversed.replace(/(\S)\[/, "$1 [");

                        console.log("Re-searching for:", newSearch)
                        for (const route of data) {
                            console.log("Option A:", route.route_descr, "?", newSearch)
                            if (route.route_descr === newSearch || route.route_descr.includes(newSearch)) {
                                console.warn("VOXNEW FOUND:", route, route.route_descr);
                                activeRouteCode = route.route_code;
                                found = true;
                                return route.route_code;
                            }
                        }
                    }

                    if (!found) {
                        console.warn("Hard to match, inserting intelligence. 🙄")
                        function levenshtein(a, b) {
                            const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
                            for (let j = 1; j <= b.length; j++) dp[0][j] = j;

                            for (let i = 1; i <= a.length; i++) {
                                for (let j = 1; j <= b.length; j++) {
                                    if (a[i - 1] === b[j - 1]) {
                                        dp[i][j] = dp[i - 1][j - 1];
                                    } else {
                                        dp[i][j] = Math.min(
                                            dp[i - 1][j] + 1,    // deletion
                                            dp[i][j - 1] + 1,    // insertion
                                            dp[i - 1][j - 1] + 1 // substitution
                                        );
                                    }
                                }
                            }
                            return dp[a.length][b.length];
                        }

                        const newSearch = reversed.replace(/(\S)\[/, "$1 [");

                        let bestRoute = null;
                        let bestScore = Infinity;

                        for (const route of data) {
                            const d = levenshtein(route.route_descr, newSearch);

                            if (d < bestScore) {
                                bestScore = d;
                                bestRoute = route;
                            }
                        }

                        if (bestRoute) {
                            console.warn("VOXINTELLI FOUND:", bestRoute, bestRoute.route_descr);
                            activeRouteCode = bestRoute.route_code;
                            found = true;
                            return bestRoute.route_code;
                        }

                        throw new Error("Route Code not found.");
                    }
                }
            } catch (error) {
                if (completeJson && completeJson.descr !== data[0].LineDescr) {
                    console.log("Will decide which one is needed on these:", data)
                    let found = false;
                    activeRouteCode = data[0].route_code;
                    if (!data[1]) {
                        return data[0].route_code;
                    }
                    for (const route of data) {
                        if (route.route_descr === completeJson.descr || route.route_descr === capitalizeGreek(completeJson.descr)) {
                            console.warn("VOXNEW FOUND:", route, route.route_descr);
                            activeRouteCode = route.route_code;
                            found = true;
                            console.log("FOUND!", route)
                            return route.route_code;
                        }
                    }
                    if (found === false) {
                        console.error(`Warning! Available lines don't match the requested one. ${data}\nRequested: ${completeJson}`)
                    }
                } else {
                    alert(`FATAL: ${error}`)
                }
            }
        }
        const getStops = encodeURIComponent(`https://telematics.oasa.gr/api/?act=getRoutesForLine&p1=${lineCode}&keyOrigin=evoxEpsilon`);
        return fetch(`https://data.evoxs.xyz/proxy?key=21&targetUrl=${getStops}&vevox=${randomString()}`)
            .then(response => response.json())
            .then(data => {
                localStorage.setItem(`getRoutesForLine_${lineCode}`, JSON.stringify(data))
                return insider(data)
            }).catch(error => {
                const localSave = localStorage.getItem(`getRoutesForLine_${lineCode}`)
                if (localSave) {
                    const use = JSON.parse(localSave)
                    return insider(use)
                } else {
                    console.error("Process crashed. Cannot revive using localstorage", error, "localSave Status:", localSave)
                }
            });
    }

    function nextUp() {
        function insider(fullLine) {
            const matchingLines = fullLine.filter(line => line.LineID === id);
            if (matchingLines.length > 0) {
                let selectedLine = matchingLines[0]
                matchingLines.forEach(line => {
                    if (line.LineDescr === capitalizeGreek(completeJson.descr)) {
                        selectedLine = line
                        console.warn("Method 2 Used.")
                    } else {
                        console.warn("Check", line.LineDescr, completeJson.descr)
                    }
                })
                console.warn('Found Lines:', matchingLines, "Selected:", selectedLine);
                return routeOasa(selectedLine.LineCode).then(resu => {
                    //triggerSave(id, selectedLine.LineCode, resu)
                    return resu;
                })
            } else {
                throw new Error("No matching lines found.");
            }
        }
        const allLinesUrl = encodeURIComponent(`https://telematics.oasa.gr/api/?act=webGetLines&keyOrigin=evoxEpsilon`);
        return fetch(`https://data.evoxs.xyz/proxy?key=21&targetUrl=${allLinesUrl}&vevox=${randomString()}`)
            .then(response => response.json())
            .then(fullLine => {
                return insider(fullLine)
            }).catch(error => {
                console.warn("Server is not accessible. Using local storage")
                const localSave = localStorage.getItem("allLines")
                if (localSave) {
                    const temp = JSON.parse(localSave)
                    return insider(temp)
                } else {
                    console.error("Process crashed. Cannot revive using localstorage [1st]", error, "localSave Status:", localSave)
                }
            });
    }

    return nextUp();
}

