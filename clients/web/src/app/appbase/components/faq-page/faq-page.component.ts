import { Component, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { Router, NavigationStart, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
	selector: "app-faq-page",
	templateUrl: "./faq-page.component.html",
	styleUrls: ["./faq-page.component.scss"]
})
export class FAQPageComponent {
	@ViewChild(FAQPageComponent)

	backBtnEnabled: boolean = false;
	currentRoute: String = "";

	faqItems: any = [
		{
			question: "Qu'est-ce que Psynder ?",
			answer: "Vous pouvez retrouver la réponse à cette question en cliquant sur l'onglet 'À propos'",
			isShown: false
		},
		{
			question: "La plateforme n'est destinée qu'aux personnes atteintes de troubles dépressifs ?",
			answer: "Initialement et pour l'instant, oui. Cependant, dans le futur (si le projet va plus loin) nous aimerions l'ouvrir à plus de troubles que ceux de la dépression.",
			isShown: false
		},
		{
			question: "Est-ce que c'est payant ?",
			answer: "Non. Nous ne souhaitons pas faire payer les personnes en recherche d'aider. De plus, étant un projet étudiant, nous n'avons pas mis en place de payement pour qui que ce soit actuellement.",
			isShown: false
		},
		{
			question: "Je suis thérapeute et j'ai créé un compte, mais je n'arrive pas à me connecter.",
			answer: "Afin d'assurer un service de qualité nous souhaitons vérifier d'abord que chaque thérapeute présent sur notre plateforme est un réel professionnel. Pour y remédier, il faudra nous contacter directement.",
			isShown: false
		},
		{
			question: "Les rendez-vous sont-ils automatiques ?",
			answer: "Non. Il faut que vous preniez au moins le premier rendez-vous avec un thérapeute. Après, celui-ci pourra définir un rendez-vous avec vous",
			isShown: false
		},
		{
			question: "Je ne peux pas prendre de rendez-vous avec un thérapeute.",
			answer: "Pour le lancement de notre BETA nous avons créé de faux compte thérapeute, il peut s'agir de l'un d'entre eux. Si vous êtes sûr qu'il s'agit d'une vraie personne, dans ce cas contactez-nous via l'onglet 'Faire un retour' et nous verrons ensemble ce qui pose problème.",
			isShown: false
		},
		{
			question: "Le site n'est disponible qu'en français ?",
			answer: "Oui puisque nous visons qu'un public francophone pour l'instant.",
			isShown: false
		},
		{
			question: "Je ne trouve pas de thérapeute près de moi.",
			answer: "Cela peut être dû au fait qu'aucun thérapeute, proche de vous, n'est inscrit sur notre plateforme. Cependant, nous ne visons que la France métropolitaine pour l'instant, ce qui peut expliquer pourquoi vous ne trouvez pas de thérapeute proche de vous.",
			isShown: false
		},
		{
			question: "Mon thérapeute n'est pas sur l'application, que faire ?",
			answer: "Peut-être que votre thérapeute ne connait pas notre plateforme. Vous pouvez lui en parler et s'il est intéressé, il nous rejoindra peut être !",
			isShown: false
		},
		{
			question: "À quoi servent les données récoltées ?",
			answer: "Les données récoltées lorsque vous répondez aux questionnaires servent à déceler de potentiels troubles dépressifs que vous pourriez avoir. Ce qui nous permet ensuite de vous conseiller des thérapeutes qui seraient aptes à soigner les potentiels troubles que vous avez. Les autres données, comme votre numéro de téléphone ou votre adresse mail, permettent à un thérapeute, avec lequel vous avez une thérapie, de vous contacter.",
			isShown: false
		},
		{
			question: "À quel point l'algorithme est fiable ?",
			answer: "Par manque de données, nous ne sommes malheureusement pas capable de répondre à cette question.",
			isShown: false
		},
		{
			question: "J'ai un soucis avec un thérapeute, que faire ?",
			answer: "Nous contacter (via l'onglet 'Faire un retour' ou sur nos réseaux sociaux en message privé) est la meilleure solution, nous essayerons de vous aider à trouver une solution.",
			isShown: false
		},
		{
			question: "Comment contribuer au projet ?",
			answer: "Tout simplement en nous faisant des retours sur les diverses fonctionnalités, sur les points que vous aimez et ceux que vous aimez moins. Pour rappel, l'onglet 'Faire un retour' vous permettra de nous contacter.",
			isShown: false
		},
		{
			question: "Pendant combien de temps encore, le site sera accéssible ?",
			answer: "Difficile à dire. Évidemment, nous aimerions le plus longtemps possible, mais aux alentours de l'été 2022 nous arrêterons les services puisque tous les membres de l'équipe auront terminé leur cursus d'études supérieurs.",
			isShown: false
		},
		{
			question: "Ma question n'est pas posée ici ou je n'ai pas trouvé de réponse complète à ma question.",
			answer: "Vous pouvez nous contacter via l'onglet 'Faire un retour' ou sur nos réseaux sociaux en message privé. N'hésitez pas !",
			isShown: false
		}
	];

	constructor(
		private tabTitle: Title,
		private location: Location,
		private router: Router,
		private route: ActivatedRoute,
	) {
		this.currentRoute = router.routerState.snapshot.url;
		router.events.subscribe(e => {
			if (e instanceof NavigationStart) {
				this.currentRoute = e.url;
			}
		});
		this.tabTitle.setTitle("Psynder | FAQ");
	}

	switchAuthRoute(e) {
		if (e.target !== undefined)
			this.currentRoute = e.target.value;
		else if (typeof e === "string")
			this.currentRoute = e;
		this.router.navigate([this.currentRoute]);
		return;
	}

	redirectToFeedbackPage() {
		this.router.navigateByUrl("/feedback");
	}

	redirectToDownloadPage() {
		this.router.navigateByUrl("/download");
	}

	redirectToLoginSignupPage() {
		this.router.navigateByUrl("/login-signup");
	}

	redirectToAboutPage() {
		this.router.navigateByUrl("/about");
	}

	redirectToLandingPage() {
		this.router.navigateByUrl("/");
	}

}
