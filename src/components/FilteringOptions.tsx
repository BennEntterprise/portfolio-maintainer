import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  setInitialOrgs,
  setBulkOrgs,
  toggleActive,
  toggleArchive,
  toggleOrg,
  togglePrivate,
  togglePublic,
  useActiveCheckbox,
  useArchiveCheckbox,
  usePrivateCheckbox,
  usePublicCheckbox,
  useSelectedOrgs,
  restoreFiltersToTrue,
} from "../redux/filteringSlice";
import { useCallback, useEffect, useMemo } from "react";

export const FilteringOptions = () => {
  const dispatch = useDispatch();
  const reposRedux = useSelector((state: RootState) => state.repo.value);
  const archiveCheckbox = useArchiveCheckbox()
  const activeCheckbox = useActiveCheckbox()
  const publicCheckbox = usePublicCheckbox()
  const privateCheckbox = usePrivateCheckbox()
  const selectedOrgs = useSelectedOrgs()

  const availableOrgsList = useMemo(() => {
    const orgs = reposRedux.reduce((acc: string[], repo) => {
      const orgName = repo.full_name.split("/")[0];
      if (!acc.includes(orgName)) {
        acc.push(orgName);
      }
      return acc;
    }, []);
    return orgs;
  }, [reposRedux]);

  const saveFilterStatusToLocalStorage = () => {
    localStorage.setItem("filterStatus", JSON.stringify({
      activeCheckbox,
      archiveCheckbox,
      publicCheckbox,
      privateCheckbox,
      selectedOrgs
    }))
  }

  const loadFilterStatusFromLocalStorage = useCallback( () => {
    const filterStatus = localStorage.getItem("filterStatus")
    if (filterStatus) {
      const filterStatusObj = JSON.parse(filterStatus)
      dispatch(toggleActive(filterStatusObj.activeCheckbox))
      dispatch(toggleArchive(filterStatusObj.archiveCheckbox))
      dispatch(togglePublic(filterStatusObj.publicCheckbox))
      dispatch(togglePrivate(filterStatusObj.privateCheckbox))
      dispatch(setBulkOrgs(filterStatusObj.selectedOrgs))
    }
  }, [dispatch])

  const resetLocalStorageFilters = () => {
    localStorage.removeItem("filterStatus")
    dispatch(restoreFiltersToTrue());
  }

  useEffect(() => {
    dispatch(setInitialOrgs(availableOrgsList));
    loadFilterStatusFromLocalStorage()
  }, [reposRedux, availableOrgsList, dispatch, loadFilterStatusFromLocalStorage]);


  return (
    <div className="mb-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Visibility</h3>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="public"
              name="visibility"
              value="public"
              className="mr-2"
              checked={publicCheckbox}
              onChange={() => dispatch(togglePublic())}
            />
            <label htmlFor="public" className="text-gray-700">
              Public
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="private"
              name="visibility"
              value="private"
              className="mr-2"
              checked={privateCheckbox}
              onChange={() => dispatch(togglePrivate())}
            />
            <label htmlFor="private" className="text-gray-700">
              Private
            </label>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Status</h3>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="active"
              name="status"
              className="mr-2"
              checked={activeCheckbox}
              onChange={() => dispatch(toggleActive())}
            />
            <label htmlFor="active" className="text-gray-700">
              Active
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="archive"
              name="status"
              className="mr-2"
              checked={archiveCheckbox}
              onChange={() => dispatch(toggleArchive())}
            />
            <label htmlFor="archive" className="text-gray-700">
              Archive
            </label>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Organization</h3>
          {availableOrgsList.map((org) => (
            <div key={org} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={org}
                name="organization"
                className="mr-2"
                value={org}
                // 👇 Bang Bang is needed to prevent undefined from throwing
                // a warning in React: uncontrolled to controlled component.
                checked={!!selectedOrgs[org]}
                onChange={(e) => {
                  dispatch(toggleOrg(e.target.value));
                }}
              />
              <label htmlFor={org} className="text-gray-700">
                {org}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div id="filter-save-buttons">
        <button
          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
          type="button"
          onClick={saveFilterStatusToLocalStorage}
        >
          Save
        </button>
        <button
          className="inline-flex w-full justify-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 sm:ml-3 sm:w-auto"
          type="button"
          onClick={loadFilterStatusFromLocalStorage}
        >
          Load
        </button>
        <button
          className="inline-flex w-full justify-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 sm:ml-3 sm:w-auto"
          type="button"
          onClick={resetLocalStorageFilters}
        >
          Reset
        </button>
      </div>
    </div>
  );
};
