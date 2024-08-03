const MINECRAFT_VERSION: string = "1.21";
const LOADER_VERSION: string = undefined;

const config = {
    showVersionCompatibility: true
}

const loadingDialog = {
    html: document.getElementById("loadingDialog") as HTMLDialogElement,
    setLoadingStatus(text: string): void {
        document.getElementById("loadingDialogStatus").innerText = text;
    }
}

interface ModList {
    required: string[];
    performance: string[];
    cosmetic: string[];
    utility: string[];
    content: string[];
}
const MODLIST: ModList = {
    required: [
        "architectury-api",
        "balm",
        "cloth-config",
        "creativecore",
        "cristel-lib",
        "fabric-api",
        "fabric-language-kotlin",
        "geckoanimfix",
        "geckolib",
        "glitchcore",
        "indium",
        "sophisticated-core-(unofficial-fabric-port)",
        "placeholder-api",
        "puzzles-lib",
        "tcdcommons",
        "terrablender",
        "yacl", // yetanotherconfiglib
        "yungs-api"
    ],
    performance: [
        "debugify",
        "dynamic-fps",
        "ebe", // enhanced block entities
        "ferrite-core",
        "immediatelyfast",
        "indium",
        "lmd", // let me despawn
        "lithium",
        "modernfix",
        "sodium",
        "spark"
    ],
    cosmetic: [
        "ambientsounds",
        "appleskin",
        "better-mount-hud",
        "better-stats",
        "betterf3",
        "boat-item-view",
        "chat-heads",
        "eating-animation",
        "entity-model-features",
        "entitytexturefeatures",
        "essential",
        "fallingleaves",
        "iris",
        "modelfix",
        "not-enough-animations",
        "simple-voice-chat",
        "sound-physics-remastered",
        "visuality",
        "better-ping-display-fabric" // ?
    ],
    utility: [
        "auth-me",
        "clumps",
        "controlify",
        "cut-through",
        "enchantment-descriptions",
        "fast-ip-ping",
        "gamma-utils",
        "harvest-with-ease",
        "inventory-sorting",
        "jade",
        "jade-addons-fabric",
        "lootr",
        "modmenu",
        "netherportalfix",
        "patchouli",
        "polymorph",
        "polymorphic-energistics",
        "reeses-sodium-options",
        "rei",
        "roughly-enough-professions-rep",
        "roughly-enough-loot-tables",
        "roughly-enough-trades",
        "show-me-what-you-got",
        "shulkerboxtooltip",
        "smarter-farmers-farmers-replant",
        "sodium-extra",
        "xaeros-world-map",
        "xaeros-minimap",
        "yosbr",
        "zoomify"
    ],
    content: [
        "ad-astra",
        "ae2", // applied energistics 2
        "amendments",
        "artifacts",
        "betterend",
        "better-end-cities-for-betterend",
        "betternether",
        "biomesyougo", //? biomes o plenty or biomes you'll go? do poll
        "chipped",
        "create-fabric",
        "create-steam-n-rails",
        "createaddition",
        "create-deco",
        "create-enchantment-industry-fabric",
        "comforts",
        "ecologics",
        "enderchests",
        "expanded-delight", //? does this work with refabricated?
        "explorify",
        "farmers-delight-refabricated",
        "farmers-knives", //? does this work with refabricated?
        "friends-and-foes",
        "gravestone-mod",
        "handcrafted",
        "hearth-and-home",
        "joy-of-painting",
        "mes-moogs-end-structures",
        "mo-structures",
        "more-mob-variants",
        "mutant-monsters",
        "naturalist",
        "natures-compass",
        "nethers-delight-refabricated",
        "powah",
        "serene-seasons",
        "slice-and-dice", // create slice and dice
        "sophisticated-backpacks-(unoffical-fabric-port)",
        "supplementaries",
        "towns-and-towers",
        "trinkets",
        "universal-sawmill",
        "universal-shops",
        "winterly",
        "yungs-better-desert-temples",
        "yungs-better-nether-fortresses",
        "yungs-better-ocean-monuments"
    ]
}

function convertCollectionToArray(HTMLCollection: HTMLCollection): HTMLElement[] {
    const array = [];
    for (let i = 0; i < HTMLCollection.length; i++) {
        array.push(HTMLCollection[i] as HTMLElement);
    }
    return array;
}

function colorizeVersionNumber(versionNumber: string): string { //! this needs snapshot detection somehow (regex?)
    if (MINECRAFT_VERSION === undefined)
        return "black"; // don't colorize it if the modpack doesn't have a version
    else if (versionNumber === MINECRAFT_VERSION)
        return "green";
    else { // not equal to MINECRAFT_VERSION
        return "red";
    }
}
function getLatestReleaseVersion(game_versions: string[]) {
    for (let i = 1; i < game_versions.length+1; i++) { //* idk why we add 1 to game_versions.length but projects that only support one version don't ever run this loop without it
        if (/^\d+\.\d+(\.\d+)?$/.test(game_versions.at(-i))) { // if it's in the format X.Y.Z
            return game_versions.at(-i);
        }
    }
    return "???"; // we were unable to find a release version number
}

function getProjectOwner(teamData: any) { //! this doesn't work with organizations, but API v2 doesn't support them either so i can't really add them even if i wanted to
    for (let i in teamData) {
        if (teamData[i]["role"] == "Owner") {
            return teamData[i]["user"]["username"];
        }
    }
    // new Error(`Unable to identify an Owner for the project "${slug}"`); // this will run if we get through the whole loop without returning a value
    return "[Unable to identify]"
}

/**
 * Creates a new mod with the specified data under the specified section
 * @param data The data for the mod. Requests are not made in this function, so the data should come from something like https://api.modrinth.com/v2/projects
 * @param teamData The data for the team of the mod. This should be obtained in bulk from https://api.modrinth.com/v2/teams so that we don't need to make an API request for each mod to get their members.
 * @param section What section to put the mod into.
 */
async function createMod(data: any, teamData: any, section: "required" | "performance" | "cosmetic" | "utility" | "content") {
    const mod = document.createElement("div") as HTMLDivElement;
    mod.setAttribute("class","mod");
        const modImageAnchor = document.createElement("a") as HTMLAnchorElement;
        modImageAnchor.setAttribute("href",`https://modrinth.com/mod/${data["slug"]}`);
        modImageAnchor.setAttribute("target","_blank");
        modImageAnchor.setAttribute("style","display: flex;"); // this is required for the image to be centered within the mod div
            const modImage = document.createElement("img") as HTMLImageElement;
            modImage.setAttribute("src",data["icon_url"]);
            modImage.setAttribute("alt",`${data["slug"]} image`);
            modImage.setAttribute("width","96px");
            modImage.setAttribute("height","96px");
            modImageAnchor.appendChild(modImage)
        mod.appendChild(modImageAnchor);

        const modContent = document.createElement("div") as HTMLDivElement;
        modContent.setAttribute("class","mod-content");
            const modName = document.createElement("h3") as HTMLHeadingElement;
                const modNameAnchor = document.createElement("a");
                modNameAnchor.innerText = data["title"]
                modNameAnchor.setAttribute("href",`https://modrinth.com/mod/${data["slug"]}`);
                modNameAnchor.setAttribute("target","_blank");
                modName.appendChild(modNameAnchor)
            modContent.appendChild(modName);

            const modAuthor = document.createElement("p") as HTMLParagraphElement;
            modAuthor.innerText = `By ${getProjectOwner(teamData)}`;
            modAuthor.setAttribute("class","mod-author");
            modContent.appendChild(modAuthor);

            const modDescription = document.createElement("p") as HTMLParagraphElement;
            modDescription.innerText = data["description"];
            modDescription.setAttribute("class","mod-description");
            modContent.appendChild(modDescription);
        mod.appendChild(modContent);
        const modContentRight = document.createElement("div") as HTMLDivElement;
        modContentRight.setAttribute("class","mod-content-right");
            if (config.showVersionCompatibility) {
                const modLatestVersionText = document.createElement("p") as HTMLParagraphElement;
                modLatestVersionText.innerText = "Latest Version:";
                modLatestVersionText.setAttribute("style","margin-bottom:0;");
                modContentRight.appendChild(modLatestVersionText);

                const modLatestVersion = document.createElement("p") as HTMLParagraphElement;
                modLatestVersion.innerText = getLatestReleaseVersion(data["game_versions"]);
                modLatestVersion.style.color = colorizeVersionNumber(getLatestReleaseVersion(data["game_versions"]));
                modLatestVersion.setAttribute("class","latest-version");
                modContentRight.appendChild(modLatestVersion);
            }
        mod.appendChild(modContentRight);
    document.getElementById(`${section}List`).appendChild(mod);
}

/**
 * This should be run when config values are changed after the site has fully loaded.
 */
function reloadModlist() {
    const requiredList = convertCollectionToArray(document.getElementById("requiredList").children); // without this we skip every other element because we're going over the .children propertie that's changing whenever we remove an element
    for (let i in requiredList) {
        requiredList[i].remove();
    }
    const performanceList = convertCollectionToArray(document.getElementById("performanceList").children);
    for (let i in performanceList) {
        performanceList[i].remove();
    }
    const cosmeticList = convertCollectionToArray(document.getElementById("cosmeticList").children);
    for (let i in cosmeticList) {
        cosmeticList[i].remove();
    }
    const utilityList = convertCollectionToArray(document.getElementById("utilityList").children);
    for (let i in utilityList) {
        utilityList[i].remove();
    }
    const contentList = convertCollectionToArray(document.getElementById("contentList").children);
    for (let i in contentList) {
        contentList[i].remove();
    }

    init();
}

async function init() {
    // show the loading dialog
    loadingDialog.html.showModal();

    // set the minecraft and loader versions
    loadingDialog.setLoadingStatus("Setting Minecraft and Fabric Loader Versions");
    document.getElementById("minecraftVersion").innerText = MINECRAFT_VERSION;
    document.getElementById("loaderVersion").innerText = LOADER_VERSION;

    // required section
    loadingDialog.setLoadingStatus("Adding mods to the Required section");
    const requiredResponse = await fetch(`https://api.modrinth.com/v2/projects?ids=${JSON.stringify(MODLIST.required)}`)
        .then((response) => response.json());
    requiredResponse.sort((a: any, b: any) => a["title"].localeCompare(b["title"])); // sort it alphabetically
    let teamsIdList: string[] = [];
    for (let i in requiredResponse) { // make an array of every team ID to use when running createMod
        teamsIdList.push(requiredResponse[i]["team"]);
    }
    const requiredTeamsResponse = await fetch(`https://api.modrinth.com/v2/teams?ids=${JSON.stringify(teamsIdList)}`)
        .then((response) => response.json());
    for (let i in requiredResponse) {
        await createMod(requiredResponse[i], requiredTeamsResponse[i], "required");
    }

    // performance section
    // loadingDialog.setLoadingStatus("Adding mods to the Performance section");
    // const performanceResponse = await fetch(`https://api.modrinth.com/v2/projects?ids=${JSON.stringify(MODLIST.performance)}`)
    //     .then((response) => response.json());
    // performanceResponse.sort((a: any, b: any) => a["title"].localeCompare(b["title"])); // sort it alphabetically
    // for (let i in performanceResponse) {
    //     await createMod(performanceResponse[i], "performance");
    // }

    // // cosmetic section
    // loadingDialog.setLoadingStatus("Adding mods to the Cosmetic section");
    // const cosmeticResponse = await fetch(`https://api.modrinth.com/v2/projects?ids=${JSON.stringify(MODLIST.cosmetic)}`)
    //     .then((response) => response.json());
    // cosmeticResponse.sort((a: any, b: any) => a["title"].localeCompare(b["title"])); // sort it alphabetically
    // for (let i in cosmeticResponse) {
    //     await createMod(cosmeticResponse[i], "cosmetic");
    // }
    
    // // utility section
    // loadingDialog.setLoadingStatus("Adding mods to the Utility section");
    // const utilityResponse = await fetch(`https://api.modrinth.com/v2/projects?ids=${JSON.stringify(MODLIST.utility)}`)
    //     .then((response) => response.json());
    // utilityResponse.sort((a: any, b: any) => a["title"].localeCompare(b["title"])); // sort it alphabetically
    // for (let i in utilityResponse) {
    //     await createMod(utilityResponse[i], "utility");
    // }

    // // content section
    // loadingDialog.setLoadingStatus("Adding mods to the Content section");
    // const contentResponse = await fetch(`https://api.modrinth.com/v2/projects?ids=${JSON.stringify(MODLIST.content)}`)
    //     .then((response) => response.json());
    // contentResponse.sort((a: any, b: any) => a["title"].localeCompare(b["title"])); // sort it alphabetically
    // for (let i in contentResponse) {
    //     await createMod(contentResponse[i], "content");
    // }

    loadingDialog.setLoadingStatus("Done!");
    setTimeout(() => {
        loadingDialog.html.close();
        loadingDialog.html.style.display = "none";
    }, 500);
}

init();