
import type { PageRoute } from "./route";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { fr } from "@codegouvfr/react-dsfr";
import { makeStyles } from "tss-react/dsfr";
import Tile from "@codegouvfr/react-dsfr/Tile";
import Card from "@codegouvfr/react-dsfr/Card";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { SoftwareCard } from "./SoftwareCard";
import Input from "@codegouvfr/react-dsfr/Input";

type Props = {
	className?: string;
	route: PageRoute;
};
export default function Home(props: Props) {
	const { route } = props

	const { t } = useTranslation({ Home });
	const { t: tCommons } = useTranslation({ App: null });
	const { cx, classes } = useStyles();

	const events = [
		{
			title: "Atelier BlueHats",
			link: {},
			imageUrl: "https://www.systeme-de-design.gouv.fr/img/placeholder.16x9.png"
		},
		{
			title: "Prise en main de react-dsfr",
			link: {},
			imageUrl: "https://www.systeme-de-design.gouv.fr/img/placeholder.16x9.png"
		}
	]

	const softwareSelection = [
		{
			logo: "https://www.systeme-de-design.gouv.fr/img/placeholder.16x9.png",
			name: "Tchap",
			description: "Description de logiciel fictive. Ce contenu est à modifier avant la mise en production",
			links: [
				{
					link:{
						href: "",
						onClick: () => {}
					},
					label: "En savoir plus"
				},
				{
					link:{
						href: "",
						onClick: () => {}
					},
					label: "Voir tout les services"
				},
			]
		},
		{
			logo: "https://www.systeme-de-design.gouv.fr/img/placeholder.16x9.png",
			name: "VLC",
			description: "Description de logiciel fictive. Ce contenu est à modifier avant la mise en production",
			links: [
				{
					link:{
						href: "",
						onClick: () => {}
					},
					label: "En savoir plus"
				},
				{
					link:{
						href: "",
						onClick: () => {}
					},
					label: "Voir tout les services"
				},
			]
		},
		{
			logo: "https://www.systeme-de-design.gouv.fr/img/placeholder.16x9.png",
			name: "Vitam",
			description: "Description de logiciel fictive. Ce contenu est à modifier avant la mise en production",
			links: [
				{
					link:{
						href: "",
						onClick: () => {}
					},
					label: "En savoir plus"
				},
				{
					link:{
						href: "",
						onClick: () => {}
					},
					label: "Voir tout les services"
				},
			]
		},
	]

	const codeGouvNumbers = [
		{
			label: t("numbers services"),
			number: 7
		},
		{
			label: t("numbers referenced software"),
			number: 326
		},
		{
			label: t("numbers deposit"),
			number: 15415
		}
	]

	const helpList = [
		{
			title: t("help guides"),
			link:{
				href: "",
				onClick: () => {}
			},
		},
		{
			title: t("help faq"),
			link:{
				href: "",
				onClick: () => {}
			},
		},
		{
			title: t("help forum"),
			link:{
				href: "",
				onClick: () => {}
			},
		}
	]

	const contributeList = [
		{
			title: t("contribute reference software"),
			link:{
				href: "",
				onClick: () => {}
			},
		},
		{
			title: t("contribute reference source code"),
			link:{
				href: "",
				onClick: () => {}
			},
		},
		{
			title: t("contribute suggest"),
			link:{
				href: "",
				onClick: () => {}
			},
		}
	]

	return (
		<>
			<section className={cx(classes.section, classes.intro, fr.cx("fr-container"))}>
				<div>
					<h2>{t("title")}</h2>
					<Button>{tCommons("find out more")}</Button>
				</div>
				<div className={classes.primaryEvents}>
					{
						events.map(event => <Card title={event.title} linkProps={event.link} imageUrl={event.imageUrl} horizontal /> )
					}
				</div>
			</section>
			<section className={cx(classes.section, classes.grid3items, fr.cx("fr-container"))}>
				{
					softwareSelection.map(software => <SoftwareCard softwareName={software.name} softwareDescription={software.description} logoUrl={software.logo} softwareLinks={software.links} /> )
				}
			</section>
			<section className={cx(classes.backgroundFullWidth, classes.section)}>
				<div className={cx(fr.cx("fr-container"), classes.numbersListContainer)}>
					<h1 className={cx(classes.whiteText, classes.numberTitle)}>
						{t("codegouv numbers")}
					</h1>
					<div className={classes.grid3items}>
						{codeGouvNumbers.map(item => (
							<div key={item.label}>
								<p
									className={cx(
										fr.cx("fr-display--sm"),
										classes.whiteText,
										classes.numberText
									)}
								>
									{item.number}
								</p>
								<h4 className={classes.whiteText}>{item.label}</h4>
							</div>
						))}
					</div>
				</div>
			</section>
			<section className={cx(classes.section, fr.cx("fr-container"))}>
				<h1>{t("help title")}</h1>
				<div className={classes.grid3items}>
					{
						helpList.map(item => <Tile title={item.title} linkProps={item.link} />)
					}
				</div>
			</section>
			<section className={cx(classes.section, fr.cx("fr-container"))}>
				<h1>{t("contribute title")}</h1>
				<div className={classes.grid3items}>
					{
						contributeList.map(item => <Tile title={item.title} linkProps={item.link} />)
					}
				</div>
			</section>


			<div className={fr.cx("fr-follow")}>
				<div className={fr.cx("fr-container")}>
					<div className={cx(fr.cx("fr-grid-row"), classes.row)}>
						<div className={fr.cx("fr-col-6")}>
							<div>
								<div className={classes.inputLine}>
									<Input
										label={t("subscribe to gazette", { gazetteName: "BlueHats" })}
										nativeInputProps={{type: "email"}}
									/>
									<Button>{tCommons("subscribe")}</Button>
								</div>
								<div className={classes.inputLine}>
									<Input
										label={t("subscribe to gazette", { gazetteName: "DSI Libre" })}
										nativeInputProps={{type: "email"}}
									/>
									<Button>{tCommons("subscribe")}</Button>
								</div>
							</div>
						</div>
						<div className={fr.cx("fr-col-6")}>
							<div className={cx(fr.cx("fr-share", "fr-col-12"))}>
								<h1 className={fr.cx("fr-h5", "fr-follow__title")}>{t("find us")}</h1>
								<ul className={cx(fr.cx("fr-share__group"), classes.shareGroup)}>
									<li>
										<a
											className={fr.cx("fr-share__link", "fr-icon-mastodon-fill")}
											href="https://mastodon.social/@CodeGouvFr"
											title={t("title follow us on", { socialMedia: "Mastodon" })}
											aria-label={t("follow us on", { socialMedia: "Mastodon" })}
										/>
									</li>
									<li>
										<a
											className={fr.cx("fr-share__link", "fr-icon-twitter-fill")}
											href="https://twitter.com/codegouvfr"
											title={t("title follow us on", { socialMedia: "Twitter" })}
											aria-label={t("follow us on", { socialMedia: "Twitter" })}
										/>
									</li>
									<li>
										<a
											className={fr.cx("fr-share__link", "fr-icon-github-fill")}
											href="https://github.com/codegouvfr"
											rel="noreferrer noopener me"
											title={t("title follow us on", { socialMedia: "Github" })}
											aria-label={t("follow us on", { socialMedia: "Github" })}
										/>
									</li>
								</ul>
								<h1 className={fr.cx("fr-h5", "fr-follow__title")}>{t("contact us")}</h1>
								<ul className={cx(fr.cx("fr-share__group"), classes.shareGroup)}>
									<li>
										<a
											className={fr.cx("fr-share__link", "fr-icon-mail-fill")}
											href="mailto:contact@code.gouv.fr"
											title={t("contact by mail")}
										>
											contact@code.gouv.fr
										</a>
									</li>
								</ul>

							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
const useStyles = makeStyles()(theme => ({
	section: {
		...fr.spacing("padding", {
			topBottom: "30v"
		}),
		[fr.breakpoints.down("md")]: {
			...fr.spacing("padding", {
				topBottom: "20v"
			})
		}
	},
	backgroundFullWidth: {
		backgroundColor: theme.decisions.background.actionHigh.blueFrance.default
	},
	titleSection: {
		marginBottom: fr.spacing("10v"),
		[fr.breakpoints.down("md")]: {
			marginBottom: fr.spacing("8v")
		}
	},
	titleContainer: {
		marginBottom: fr.spacing("10v"),
		display: "flex"
	},
	intro: {
		display: "flex",
		gap: fr.spacing("6v"),
		[fr.breakpoints.down("md")]: {
			flexDirection: "column"
		}
	},
	primaryEvents: {
		display: "flex",
		flexDirection: "column",
		gap: fr.spacing("8v")
	},
	numbersListContainer: {
		textAlign: "center"
	},
	grid3items: {
		display: "grid",
		gridTemplateColumns: "repeat(3, 1fr)",
		columnGap: fr.spacing("6v"),
		[fr.breakpoints.down("md")]: {
			gridTemplateColumns: `repeat(1, 1fr)`,
			rowGap: fr.spacing("4v")
		},
	},
	whiteText: {
		color: theme.decisions.text.inverted.grey.default
	},
	numberTitle: {
		marginBottom: fr.spacing("20v")
	},
	numberText: {
		marginBottom: fr.spacing("1v")
	},
	inputLine: {
		display: "flex",
		alignItems: "flex-end",

		"&:not(last-of-type)": {
			marginBottom: fr.spacing("6v")
		},

		"& .fr-input-group": {
			marginBottom: 0
		},
	},
	shareGroup: {
		order: "initial",
		marginBottom: fr.spacing("4v"),

		".fr-share__link": {
			marginBottom: 0
		}
	},
	row: {
		"& .fr-col-6": {
			[fr.breakpoints.down("md")]: {
				flex: "0 0 100%",
				width: "100%",
				maxWidth: "100%"
			},
		}
	}
}));


export const { i18n } = declareComponentKeys<
	{
		K: "title";
		R: JSX.Element;
	}
	| "codegouv numbers"
	| "numbers services"
	| "numbers referenced software"
	| "numbers deposit"
	| "help title"
	| "help guides"
	| "help faq"
	| "help forum"
	| "contribute title"
	| "contribute reference software"
	| "contribute reference source code"
	| "contribute suggest"
	| "find us"
	| "contact us"
	| "contact by mail"
	| { K: "follow us on"; P: { socialMedia: string } }
	| { K: "title follow us on"; P: { socialMedia: string } }
	| { K: "subscribe to gazette"; P: { gazetteName: string } }
>()({ Home });
