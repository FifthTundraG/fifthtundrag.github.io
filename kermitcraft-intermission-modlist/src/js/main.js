var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
function getProjectOwner(slug) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
function createMod(data, section) {
    return __awaiter(this, void 0, void 0, function* () {
        const mod = document.createElement("div");
        mod.setAttribute("class", "mod");
        const modImage = document.createElement("img");
        modImage.setAttribute("src", data["icon_url"]);
        modImage.setAttribute("alt", `${data["slug"]} image`);
        modImage.setAttribute("width", "96px");
        modImage.setAttribute("height", "96px");
        mod.appendChild(modImage);
        const modContent = document.createElement("div");
        modContent.setAttribute("class", "mod-content");
        const modName = document.createElement("h3");
        modName.innerText = data["title"];
        modContent.appendChild(modName);
        const modAuthor = document.createElement("p");
        modAuthor.innerText = `By ${yield getProjectOwner(data["slug"])}`;
        modAuthor.setAttribute("class", "mod-author");
        modContent.appendChild(modAuthor);
        const modDescription = document.createElement("p");
        modDescription.innerText = data["description"];
        modDescription.setAttribute("class", "mod-description");
        modContent.appendChild(modDescription);
        mod.appendChild(modContent);
        document.getElementById(`${section}List`).appendChild(mod);
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const requiredResponse = yield fetch(`https://api.modrinth.com/v2/projects?ids=${JSON.stringify(MODLIST.required)}`)
            .then((response) => response.json());
        for (let i in requiredResponse) {
            yield createMod(requiredResponse[i], "required");
        }
        const performanceResponse = yield fetch(`https://api.modrinth.com/v2/projects?ids=${JSON.stringify(MODLIST.performance)}`)
            .then((response) => response.json());
        for (let i in performanceResponse) {
            yield createMod(performanceResponse[i], "performance");
        }
        const cosmeticResponse = yield fetch(`https://api.modrinth.com/v2/projects?ids=${JSON.stringify(MODLIST.cosmetic)}`)
            .then((response) => response.json());
        for (let i in cosmeticResponse) {
            yield createMod(cosmeticResponse[i], "cosmetic");
        }
        const utilityResponse = yield fetch(`https://api.modrinth.com/v2/projects?ids=${JSON.stringify(MODLIST.utility)}`)
            .then((response) => response.json());
        for (let i in utilityResponse) {
            yield createMod(utilityResponse[i], "utility");
        }
        const contentResponse = yield fetch(`https://api.modrinth.com/v2/projects?ids=${JSON.stringify(MODLIST.content)}`)
            .then((response) => response.json());
        for (let i in contentResponse) {
            yield createMod(contentResponse[i], "content");
        }
    });
}
init();
