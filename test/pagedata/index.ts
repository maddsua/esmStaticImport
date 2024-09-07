import staticImport from "../../esmStaticImport.ts";

const rawModule = `

	export const pageData: PageData = {
		title: {
			en: "WHOIS info",
			uk: "Інформація WHOIS",
			pt: "Informações WHOIS"
		},
		description: {
			en: "Get info about a website, IP address or a network from WHOIS",
			uk: "Отримайте інформацію про веб-сайт, IP-адресу чи мережу з WHOIS",
			pt: "Obtenha informações sobre um site, endereço IP ou uma rede da WHOIS"
		},
		layout: {
			app: true,
		},
	};

`;

console.log(staticImport(rawModule, 'pageData'));
