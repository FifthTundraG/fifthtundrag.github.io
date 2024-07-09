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
    required: [
        "architectury-api",
        "balm",
        "cloth-config",
        "creativecore",
        "cristel-lib",
        "fabric-api",
        "fabric-language-kotlin",
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
    performance: [
        "dynamic-fps",
        "ebe",
        "ferrite-core",
        "immediatelyfast",
        "lmd",
        "lithium",
        "memoryleakfix",
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
    utility: [
        "auth-me",
        "clumps",
        "controlify",
        "emi",
        "enchantment-descriptions",
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
        "show-me-what-you-got",
        "shulkerboxtooltip",
        "sodium-extra",
        "xaeros-world-map",
        "xaeros-minimap",
        "zoomify"
    ],
    content: [
        "ad-astra",
        "ae2",
        "artifacts",
        "betterend",
        "better-end-cities-base",
        "biomesyougo",
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
        "hearth-and-home",
        "incendium",
        "joy-of-painting",
        "mes-moogs-end-structures",
        "mo-structures",
        "more-mob-variants",
        "mutant-monsters",
        "naturalist",
        "natures-compass",
        "powah",
        "serene-seasons",
        "slice-and-dice",
        "sophisticated-backpacks-(unoffical-fabric-port)",
        "supplementaries",
        "towns-and-towers",
        "trinkets",
        "universal-shops",
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
    else if (versionNumber === MINECRAFT_VERSION)
        return "green";
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
async function getProjectOwner(slug) {
    return fetch(`https://api.modrinth.com/v2/project/${slug}/members`)
        .then((response) => response.json())
        .then((json) => {
        for (let i in json) {
            if (json[i]["role"] == "Owner") {
                return json[i]["user"]["username"];
            }
        }
        new Error(`Unable to identify an Owner for the project "${slug}"`);
        return "[Unable to identify]";
    });
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
    modNameAnchor.innerText = data["title"];
    modNameAnchor.setAttribute("href", `https://modrinth.com/mod/${data["slug"]}`);
    modNameAnchor.setAttribute("target", "_blank");
    modName.appendChild(modNameAnchor);
    modContent.appendChild(modName);
    const modAuthor = document.createElement("p");
    modAuthor.innerText = `By ${await getProjectOwner(data["slug"])}`;
    modAuthor.setAttribute("class", "mod-author");
    modContent.appendChild(modAuthor);
    const modDescription = document.createElement("p");
    modDescription.innerText = data["description"];
    modDescription.setAttribute("class", "mod-description");
    modContent.appendChild(modDescription);
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
    loadingDialog.setLoadingStatus("Adding mods to the Required section");
    const requiredResponse = await fetch(`https://api.modrinth.com/v2/projects?ids=${JSON.stringify(MODLIST.required)}`)
        .then((response) => response.json());
    requiredResponse.sort((a, b) => a["title"].localeCompare(b["title"]));
    for (let i in requiredResponse) {
        await createMod(requiredResponse[i], "required");
    }
    loadingDialog.setLoadingStatus("Adding mods to the Performance section");
    const performanceResponse = await fetch(`https://api.modrinth.com/v2/projects?ids=${JSON.stringify(MODLIST.performance)}`)
        .then((response) => response.json());
    performanceResponse.sort((a, b) => a["title"].localeCompare(b["title"]));
    for (let i in performanceResponse) {
        await createMod(performanceResponse[i], "performance");
    }
    loadingDialog.setLoadingStatus("Adding mods to the Cosmetic section");
    const cosmeticResponse = await fetch(`https://api.modrinth.com/v2/projects?ids=${JSON.stringify(MODLIST.cosmetic)}`)
        .then((response) => response.json());
    cosmeticResponse.sort((a, b) => a["title"].localeCompare(b["title"]));
    for (let i in cosmeticResponse) {
        await createMod(cosmeticResponse[i], "cosmetic");
    }
    loadingDialog.setLoadingStatus("Adding mods to the Utility section");
    const utilityResponse = await fetch(`https://api.modrinth.com/v2/projects?ids=${JSON.stringify(MODLIST.utility)}`)
        .then((response) => response.json());
    utilityResponse.sort((a, b) => a["title"].localeCompare(b["title"]));
    for (let i in utilityResponse) {
        await createMod(utilityResponse[i], "utility");
    }
    loadingDialog.setLoadingStatus("Adding mods to the Content section");
    const contentResponse = await fetch(`https://api.modrinth.com/v2/projects?ids=${JSON.stringify(MODLIST.content)}`)
        .then((response) => response.json());
    contentResponse.sort((a, b) => a["title"].localeCompare(b["title"]));
    for (let i in contentResponse) {
        await createMod(contentResponse[i], "content");
    }
    loadingDialog.setLoadingStatus("Done!");
    setTimeout(() => {
        loadingDialog.html.close();
        loadingDialog.html.style.display = "none";
    }, 500);
}
init();
