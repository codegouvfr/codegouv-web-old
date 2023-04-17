import type { ThunkAction, State as RootState } from "core/core";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import type { Dependency, Organisation, Repository, RepositoryStatistics } from "core/ports/CodeGouvApi";
import { createObjectThatThrowsIfAccessed } from "redux-clean-architecture";
import { uniqBy } from "lodash"
import { pipe } from "lodash/fp"
import memoize from "memoizee";
import { Fzf } from "fzf"
import { assert, type Equals } from "tsafe";

import {categories as mockCategories, repositories as mockRepositories, languages as mockLanguages} from "core/usecases/mock/catalog"
import { between } from "../../ui/tools/num";

export type State = {
	repositories: State.RepositoryInternal[];
	isLoading: boolean;
	repositoryStatistics: RepositoryStatistics;
	administrations: State.Administration[]
	categories: State.Category[]
	languages: State.Language[];
	licences: State.Licence[];
	dependencies: Dependency[]
	organisations: Organisation[]
	organisationNames: State.OrganisationName[]
	sort: State.Sort
	search: string
	selectedAdministrations: State.Administration[]
	selectedCategories: State.Category[]
	selectedDependencies : State.Dependency[]
	selectedFunctions: State.Function[]
	selectedVitality: State.Vitality[]
	selectedLanguages: State.Language[]
	selectedLicences: State.Licence[]
	selectedDevStatus: State.DevStatus[]
	selectedOrganisations: State.OrganisationName[]
	isExperimentalReposHidden: boolean
};

export namespace State {
	export type RepositoryInternal = Repository
	export type Sort =
		| "name_asc"
		| "name_desc"
		| "last_update_asc"
		| "last_update_desc"
	export type Administration = string
	export type Category = string
	export type Dependency = string
	export type Function = "Algorithm" | "Library" | "Source Code"
	export type Vitality = number
	export type Language = string
	export type Licence = string
	export type DevStatus = 'Concept' | 'Alpha' | 'Beta' | 'RC' | 'Stable'
	export type OrganisationName = string
}

export const name = "catalog" as const;

/**
 * Mocked data (see initialisation with mock in privateThunks > "initialize" method)
 * - categories
 * - repositories
 * - languages
 */

export type UpdateFilterParams<
	K extends UpdateFilterParams.Key = UpdateFilterParams.Key
> = {
	key: K;
	value: State[K];
};

export namespace UpdateFilterParams {
	export type Key = keyof Omit<State, "repositories" | "isLoading">;
}

export const { reducer, actions } = createSlice({
	name,
	initialState: createObjectThatThrowsIfAccessed<State>({
		"debugMessage": "State not initialized yet"
	}),
	reducers: {
		initialized: (
			_state,
			{ payload }: PayloadAction<{
				repositories: Repository[];
				repositoryStatistics: RepositoryStatistics;
				languages: State.Language[];
				administrations: State.Administration[];
				licences: State.Licence[];
				dependencies: Dependency[];
				categories: State.Category[];
				organisations: Organisation[];
				organisationNames: State.OrganisationName[]
			}>) => {
			const {
				repositories,
				repositoryStatistics,
				languages,
				administrations,
				licences,
				dependencies,
				categories,
				organisations,
				organisationNames,
			} = payload;

			const sort: State.Sort = "name_asc";

			return {
				repositories,
				filter: undefined,
				isLoading: false,
				repositoryStatistics,
				languages,
				administrations,
				licences,
				dependencies,
				categories,
				organisations,
				organisationNames,
				sort,
				search: "",
				selectedAdministrations: [],
				selectedCategories: [],
				selectedDependencies: [],
				selectedFunctions: [],
				selectedVitality: [],
				selectedLanguages: [],
				selectedLicences: [],
				selectedDevStatus: [],
				selectedOrganisations: [],
				isExperimentalReposHidden: false
			};

		},
		addRepositoryStarted: state => {
			state.isLoading = true;
		},
		addRepositoryCompleted: (state, { payload }: PayloadAction<{ newRepository: Repository; }>) => {
			const { newRepository } = payload;

			state.isLoading = false;
			state.repositories.push(newRepository);

		},
		filterUpdated: (state, { payload }: PayloadAction<UpdateFilterParams>) => {
			const { key, value } = payload;

			(state as any)[key] = value;
		},
		sortUpdated: (
			state,
			{ payload }: PayloadAction<{ sort: State.Sort }>
		) => {
			const { sort } = payload;

			state.sort = sort
		},
	},
});

export const privateThunks = {
	initialize:
		(): ThunkAction =>
			async (...args) => {

				const [dispatch, , { codeGouvApi }] = args;

				const repositories = await mockRepositories;
				/*const repositories = await codeGouvApi.getRepositories();*/
				const repositoryStatistics = await codeGouvApi.getRepositoryStatistics();
				/*const languages = await codeGouvApi.getLanguages();*/
				const languages = await mockLanguages;
				const administrations = await codeGouvApi.getAdministrations();
				const licences = await codeGouvApi.getLicences()
				const dependencies = await codeGouvApi.getDependencies();
				const categories = await mockCategories
				const organisations = await codeGouvApi.getOrganisations()
				const organisationNames = await codeGouvApi.getOrganisationNames()

				dispatch(actions.initialized({
					repositories,
					repositoryStatistics,
					languages,
					administrations,
					licences,
					dependencies,
					categories,
					organisations,
					organisationNames
				}));
			},
};

export const thunks = {
	/*addRepository:
		(params: { url: string; }): ThunkAction =>
			async (...args) => {

				const { url } = params;

				const [dispatch, , { codeGouvApi }] = args;

				dispatch(actions.addRepositoryStarted());
			},*/
	updateFilter:
		<K extends UpdateFilterParams.Key>(
			params: UpdateFilterParams<K>
		): ThunkAction<void> =>
			(...args) => {
				const [dispatch] = args;
				dispatch(actions.filterUpdated(params));
			},
	updateSort:
		(
			params: Record<"sort", State.Sort>
		): ThunkAction<void> =>
			(...args) => {
				const [dispatch] = args;
				dispatch(actions.sortUpdated(params));
			},
};

export const selectors = (() => {
	const sliceState = (rootState: RootState) => {
		return rootState[name];
	};

	const internalRepositories = (rootState: RootState) =>
		rootState.catalog.repositories;

	const isLoading = createSelector(sliceState, state => state.isLoading);
	const repositoryStatistics = createSelector(sliceState, state => state.repositoryStatistics);
	const administrations = createSelector(sliceState, state => state.administrations);
	const categories = createSelector(sliceState, state => state.categories);
	const languages = createSelector(sliceState, state => state.languages);
	const licences = createSelector(sliceState, state => state.licences);
	const devStatus = createSelector(sliceState, state => uniqBy(state.repositories, "status").map(repo => repo.status))
	const sort = createSelector(sliceState, state => state.sort);
	const search = createSelector(sliceState, state => state.search)
	const selectedAdministrations = createSelector(sliceState, state => state.selectedAdministrations)
	const selectedCategories = createSelector(sliceState, state => state.selectedCategories)
	const selectedDependencies = createSelector(sliceState, state => state.selectedDependencies)
	const selectedFunctions = createSelector(sliceState, state => state.selectedFunctions)
	const selectedVitality = createSelector(sliceState, state => state.selectedVitality)
	const selectedLanguages = createSelector(sliceState, state => state.selectedLanguages)
	const selectedLicences = createSelector(sliceState, state => state.selectedLicences)
	const selectedDevStatus = createSelector(sliceState, state => state.selectedDevStatus)
	const selectedOrganisations = createSelector(sliceState, state => state.selectedOrganisations)
	const organisations = createSelector(sliceState, state => state.organisations)
	const dependencies = createSelector(sliceState, state => state.dependencies);
	const isExperimentalReposHidden = createSelector(sliceState, state => state.isExperimentalReposHidden);

	const { filterBySearch } = (() => {
		const getFzf = memoize(
			(repos: State.RepositoryInternal[]) =>
				new Fzf(repos, { "selector": ({ name }) => name }),
			{ "max": 1 }
		);

		const filterBySearchMemoized = memoize(
			(repos: State.RepositoryInternal[], search: string) =>
				new Set(
					getFzf(repos)
						.find(search)
						.map(({ item: { name } }) => name)
				),
			{ "max": 1 }
		);

		function filterBySearch(params: {
			repos: State.RepositoryInternal[];
			search: string;
		}) {
			const { repos, search } = params;

			const reposIds = filterBySearchMemoized(repos, search);

			return repos.filter(({ name }) => reposIds.has(name));
		}

		return { filterBySearch };
	})();

	const filterByAdministration = (repos: Repository[], organisations: Organisation[], selectedAdministrations: string[]): Repository[] => {

		/*
		* Administrations are linked to software by organisation
		* We must find organisations linked to selected administrations to filter repositories
		*/
		const selectedOrganisationsByAdministration = organisations
			.filter(organisation => {
					return organisation.administrations.some(administration => selectedAdministrations.includes(administration))
				}
			).map(organisation => organisation.name)

		return repos.filter(repo => selectedOrganisationsByAdministration.some(organisation => repo.organisation_name.includes(organisation)))
	}

	const filterByDependencies = (repos: Repository[], dependencies: Dependency[], selectedDependenciesNames: string[]): Repository[] => {
		const selectedDependencies = dependencies.filter(dependency => selectedDependenciesNames.includes(dependency.name))

		return repos.filter(repo => selectedDependencies.some(dependency => dependency.repository_urls.includes(repo.url)))
	}

	const filterByVitality = (repos: Repository[], selectedVitality: number[]): Repository[] => {
		return repos.filter(repo => between(repo.vitality, selectedVitality[0], selectedVitality[1]))
	}

	const sortRepos = (repos: Repository[], sort: State.Sort) => {
		switch (sort) {
			case "name_asc":
			default:
				return [...repos].sort((repoA, repoB) => repoA.name.localeCompare(repoB.name))

			case "name_desc":
				return repos.sort((repoA, repoB) => repoB.name.localeCompare(repoA.name))

			case "last_update_asc":
				return repos.sort((repoA, repoB) => repoB.last_updated - repoA.last_updated)

			case "last_update_desc":
				return repos.sort((repoA, repoB) => repoA.last_updated - repoB.last_updated)
		}
	}

	const filteredRepositories = createSelector(
		internalRepositories,
		sort,
		search,
		selectedAdministrations,
		selectedCategories,
		selectedDependencies,
		selectedFunctions,
		selectedVitality,
		selectedLanguages,
		selectedLicences,
		selectedDevStatus,
		selectedOrganisations,
		isExperimentalReposHidden,
		organisations,
		dependencies,
		(
			internalRepositories,
			sort,
			search,
			selectedAdministrations,
			selectedCategories,
			selectedDependencies,
			selectedFunctions,
			selectedVitality,
			selectedLanguages,
			selectedLicences,
			selectedDevStatus,
			selectedOrganisations,
			isExperimentalReposHidden,
			organisations,
			dependencies,
		) => (
			pipe(
				(repos: Repository[]) => isExperimentalReposHidden ? repos.filter(repo => !repo.is_experimental) : repos,
				(repos: Repository[]) => search ? filterBySearch({ repos, search }) : repos,
				(repos: Repository[]) => selectedAdministrations.length ? filterByAdministration(repos, organisations, selectedAdministrations) : repos,
				(repos: Repository[]) => selectedCategories.length ? repos.filter(repo => selectedCategories.some(selectedCategory => repo.topics.includes(selectedCategory))) : repos,
				(repos: Repository[]) => selectedDependencies.length ? filterByDependencies(repos, dependencies, selectedDependencies) : repos,
				(repos: Repository[]) => selectedFunctions.length ? repos.filter(repo => selectedFunctions.some(selectedFunction => repo.type.includes(selectedFunction))) : repos,
				(repos: Repository[]) => selectedVitality.length ? filterByVitality(repos, selectedVitality) : repos,
				(repos: Repository[]) => selectedLanguages.length ? repos.filter(repo => selectedLanguages.some(selectedLanguage => repo.language.includes(selectedLanguage))) : repos,
				(repos: Repository[]) => selectedLicences.length ? repos.filter(repo => selectedLicences.some(selectedLicence => repo.license.includes(selectedLicence))) : repos,
				(repos: Repository[]) => selectedDevStatus.length ? repos.filter(repo => selectedDevStatus.some(selectedStatus => repo.status.includes(selectedStatus))) : repos,
				(repos: Repository[]) => selectedOrganisations.length ? repos.filter(repo => selectedOrganisations.some(selectedOrganisation => repo.organisation_name.includes(selectedOrganisation))) : repos,
				(repos: Repository[]) => sortRepos(repos, sort),
			)(internalRepositories) as Repository[]
		)
	);

	const sortOptions =  createSelector(sliceState, _state => {
		const sorts = [
			"name_asc" as const,
			"name_desc" as const,
			"last_update_asc" as const,
			"last_update_desc" as const,
		];

		assert<Equals<(typeof sorts)[number], State.Sort>>();

		return sorts;
	});

	const administrationsFilterOptions = createSelector(sliceState, state => {
		return state.administrations;
	});

	const categoriesFilterOptions = createSelector(sliceState, state => {
		return state.categories;
	});

	const dependenciesFilterOptions = createSelector(sliceState, state => {
		return state.dependencies.map(dependency => dependency.name);
	});

	const functionFilterOptions = createSelector(
		internalRepositories,
		(
			internalRepositories,
		) => {
			return uniqBy(internalRepositories, "type").map(repo => repo.type)
		}
	);

	const languagesFilterOptions = createSelector(sliceState, state => {
		return state.languages;
	});

	const licencesFilterOptions = createSelector(sliceState, state => {
		return state.licences;
	});

	const devStatusFilterOptions = createSelector(sliceState, _state => {
		const options: State.DevStatus[] = ["Beta", "RC", "Concept", "Alpha", "Stable"]

		return options;
	});

	const organisationsFilterOptions = createSelector(sliceState, state => {
		return state.organisationNames;
	});

	return {
		isLoading,
		repositoryStatistics,
		languages,
		administrations,
		licences,
		devStatus,
		selectedFunctions,
		organisations,
		dependencies,
		categories,
		sortOptions,
		administrationsFilterOptions,
		categoriesFilterOptions,
		dependenciesFilterOptions,
		functionFilterOptions,
		languagesFilterOptions,
		licencesFilterOptions,
		devStatusFilterOptions,
		organisationsFilterOptions,
		filteredRepositories
	};
})();
