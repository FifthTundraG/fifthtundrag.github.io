const MINECRAFT_VERSION = "1.21";
const LOADER_VERSION = undefined;
const config = {
    showVersionCompatibility: true
};
const loadingDialog = {
    html: document.getElementById("loadingDialog"),
    setLoadingStatus(text) {
        document.getElementById("loadingDialogStatus").innerText = text;
    }
};
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
        "yacl",
        "yungs-api"
    ],
    "performance": [
        "debugify",
        "dynamic-fps",
        "ebe",
        "ferrite-core",
        "immediatelyfast",
        "indium",
        "lmd",
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
        "better-ping-display-fabric"
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
        "ae2",
        "amendments",
        "artifacts",
        "betterend",
        "better-end-cities-for-betterend",
        "betternether",
        "biomesyougo",
        "chipped",
        "create-fabric",
        "create-steam-n-rails",
        "createaddition",
        "create-deco",
        "create-enchantment-industry-fabric",
        "comforts",
        "ecologics",
        "enderchests",
        "expanded-delight",
        "explorify",
        "farmers-delight-refabricated",
        "farmers-knives",
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
        "slice-and-dice",
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
};
function convertCollectionToArray(HTMLCollection) {
    const array = [];
    for (let i = 0; i < HTMLCollection.length; i++) {
        array.push(HTMLCollection[i]);
    }
    return array;
}
function colorizeVersionNumber(versionNumber) {
    if (MINECRAFT_VERSION === undefined)
        return "black";
    if (compareSemver(MINECRAFT_VERSION, versionNumber)) {
        return "green";
    }
    else {
        return "red";
    }
}
function getLatestReleaseVersion(game_versions) {
    for (let i = 1; i < game_versions.length + 1; i++) {
        if (/^\d+\.\d+(\.\d+)?$/.test(game_versions.at(-i))) {
            return game_versions.at(-i);
        }
    }
    return "???";
}
function compareSemver(version, versionToCheckAgainst) {
    const parseSemver = (version) => {
        const main = version.split('-')[0];
        const [major, minor, patch] = main.split('.').map(Number);
        return { major, minor, patch };
    };
    const v1 = parseSemver(version);
    const v2 = parseSemver(versionToCheckAgainst);
    if (v1.major !== v2.major)
        return v1.major > v2.major ? false : true;
    if (v1.minor !== v2.minor)
        return v1.minor > v2.minor ? false : true;
    if (v1.patch !== v2.patch)
        return v1.patch > v2.patch ? false : true;
    return true;
}
async function getProjectOwner(projectData) {
    if (projectData["organization"] !== null) {
        return fetch(`https://api.modrinth.com/v3/organization/${projectData["organization"]}`)
            .then((response) => response.json())
            .then((json) => {
            try {
                return json["name"];
            }
            catch (e) {
                console.error(`An unexpected error occured when getting organization ${projectData["organization"]}'s name: ${e}`);
                return "[Unable to identify]";
            }
        });
    }
    else {
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
async function createMod(data, section) {
    const mod = document.createElement("div");
    mod.setAttribute("class", "mod");
    const modImageAnchor = document.createElement("a");
    modImageAnchor.setAttribute("href", `https://modrinth.com/mod/${data["slug"]}`);
    modImageAnchor.setAttribute("target", "_blank");
    modImageAnchor.setAttribute("style", "display: flex;");
    const modImage = document.createElement("img");
    modImage.setAttribute("src", data["icon_url"]);
    modImage.setAttribute("alt", `${data["slug"]} image`);
    modImage.setAttribute("width", "96px");
    modImage.setAttribute("height", "96px");
    modImageAnchor.appendChild(modImage);
    mod.appendChild(modImageAnchor);
    const modContent = document.createElement("div");
    modContent.setAttribute("class", "mod-content");
    const modName = document.createElement("h3");
    const modNameAnchor = document.createElement("a");
    modNameAnchor.innerText = data["name"];
    modNameAnchor.setAttribute("href", `https://modrinth.com/mod/${data["slug"]}`);
    modNameAnchor.setAttribute("target", "_blank");
    modName.appendChild(modNameAnchor);
    modContent.appendChild(modName);
    const modAuthor = document.createElement("p");
    modAuthor.innerText = `By ${await getProjectOwner(data)}`;
    modAuthor.setAttribute("class", "mod-author");
    modContent.appendChild(modAuthor);
    const modSummary = document.createElement("p");
    modSummary.innerText = data["summary"];
    modSummary.setAttribute("class", "mod-description");
    modContent.appendChild(modSummary);
    mod.appendChild(modContent);
    const modContentRight = document.createElement("div");
    modContentRight.setAttribute("class", "mod-content-right");
    if (config.showVersionCompatibility) {
        const modLatestVersionText = document.createElement("p");
        modLatestVersionText.innerText = "Latest Version:";
        modLatestVersionText.setAttribute("style", "margin-bottom:0;");
        modContentRight.appendChild(modLatestVersionText);
        const modLatestVersion = document.createElement("p");
        modLatestVersion.innerText = getLatestReleaseVersion(data["game_versions"]);
        modLatestVersion.style.color = colorizeVersionNumber(getLatestReleaseVersion(data["game_versions"]));
        modLatestVersion.setAttribute("class", "latest-version");
        modContentRight.appendChild(modLatestVersion);
    }
    mod.appendChild(modContentRight);
    document.getElementById(`${section}List`).appendChild(mod);
}
function reloadModlist() {
    const requiredList = convertCollectionToArray(document.getElementById("requiredList").children);
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
    loadingDialog.html.showModal();
    loadingDialog.setLoadingStatus("Setting Minecraft and Fabric Loader Versions");
    document.getElementById("minecraftVersion").innerText = MINECRAFT_VERSION;
    document.getElementById("loaderVersion").innerText = LOADER_VERSION;
    for (let section in MODLIST) {
        loadingDialog.setLoadingStatus(`Adding mods to the ${section} section`);
        const requiredResponse = await fetch(`https://api.modrinth.com/v3/projects?ids=${JSON.stringify(MODLIST[section])}`)
            .then((response) => response.json());
        requiredResponse.sort((a, b) => a["name"].localeCompare(b["name"]));
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
