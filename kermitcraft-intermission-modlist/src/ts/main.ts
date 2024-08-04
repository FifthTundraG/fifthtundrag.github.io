//* Note:
// Because of limitations in Modrinth's v2 API that make development a nightmare, this project ONLY has support
// for v3 of the API. v3 is not yet considered stable, so errors may occur.

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

// interface ModList {
//     required: string[];
//     performance: string[];
//     cosmetic: string[];
//     utility: string[];
//     content: string[];
// }
const MODLIST = {
    "required": [
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
    "performance": [
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
    "cosmetic": [
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
    "utility": [
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
    "content": [
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

/**
 * Returns the project owner as a Promise<string>, if the project is owned by an organization it will return that, if a project is owned by an individual it will return that.
 * @param projectData The data for the project. This should come from https://api.modrinth.com/v3/projects
 */
async function getProjectOwner(projectData: any): Promise<string> {
    if (projectData["organization"] !== null) {
        return fetch(`https://api.modrinth.com/v3/organization/${projectData["organization"]}`) // we only make a request if the project is owned by an organization because code complexity goes way up if we make a req outside of this function, it won't slow down the execution too much either since most mods are owned by users
            .then((response) => response.json())
            .then((json) => {
                try {
                    return json["name"];
                } catch (e) {
                    console.error(`An unexpected error occured when getting organization ${projectData["organization"]}'s name: ${e}`);
                    return "[Unable to identify]";
                }
            });
    } else { // it's NOT owned by an organization
        return fetch(`https://api.modrinth.com/v3/project/${projectData["slug"]}/members`)
            .then((response) => response.json())
            .then((json) => {
                for (let i in json) {
                    if (json[i]["is_owner"] == true) {
                        return json[i]["user"]["username"];
                    }
                }
                console.error(`Unable to identify an Owner for the project "${projectData["slug"]}"`);
                return "[Unable to identify]";
            });
    }
}

/**
 * Creates a new mod with the specified data under the specified section
 * @param data The data for the mod. Requests are not made in this function, so the data should come from something like https://api.modrinth.com/v3/projects
 * @param teamData The data for the team of the mod. This should be obtained in bulk from https://api.modrinth.com/v3/teams so that we don't need to make an API request for each mod to get their members.
 * @param section What section to put the mod into. Should be "required" | "performance" | "cosmetic" | "utility" | "content"
 */
async function createMod(data: any, section: string) {
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
                modNameAnchor.innerText = data["name"]
                modNameAnchor.setAttribute("href",`https://modrinth.com/mod/${data["slug"]}`);
                modNameAnchor.setAttribute("target","_blank");
                modName.appendChild(modNameAnchor)
            modContent.appendChild(modName);

            const modAuthor = document.createElement("p") as HTMLParagraphElement;
            modAuthor.innerText = `By ${await getProjectOwner(data)}`;
            modAuthor.setAttribute("class","mod-author");
            modContent.appendChild(modAuthor);

            const modSummary = document.createElement("p") as HTMLParagraphElement;
            modSummary.innerText = data["summary"];
            modSummary.setAttribute("class","mod-description");
            modContent.appendChild(modSummary);
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
    const requiredList = convertCollectionToArray(document.getElementById("requiredList").children); // without convertCollectionToArray we skip every other element because we're going over the .children property and that's changing whenever we remove an element
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

    for (let section in MODLIST) {
        loadingDialog.setLoadingStatus(`Adding mods to the ${section} section`);
        const requiredResponse = await fetch(`https://api.modrinth.com/v3/projects?ids=${JSON.stringify(MODLIST[section as keyof typeof MODLIST])}`)
            .then((response) => response.json());
        requiredResponse.sort((a: any, b: any) => a["name"].localeCompare(b["name"])); // sort it alphabetically

        for (let i in requiredResponse) {
            await createMod(requiredResponse[i], section);
        }
    }

    loadingDialog.setLoadingStatus("Done!");
    setTimeout(() => {
        loadingDialog.html.close();
        loadingDialog.html.style.display = "none";
    }, 500);
}

init();