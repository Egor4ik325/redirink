import React, { useState, useEffect, createContext } from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { Routes } from "../routes";

// pages
import Presentation from "./Presentation";
import Upgrade from "./Upgrade";
import DashboardOverview from "./dashboard/DashboardOverview";
import Transactions from "./Transactions";
import Settings from "./Settings";
import BootstrapTables from "./tables/BootstrapTables";
import Signin from "./examples/Signin";
import Signup from "./examples/Signup";
import ForgotPassword from "./examples/ForgotPassword";
import ResetPassword from "./examples/ResetPassword";
import Lock from "./examples/Lock";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";
import Links from "./Links";

// documentation pages
import DocsOverview from "./documentation/DocsOverview";
import DocsDownload from "./documentation/DocsDownload";
import DocsQuickStart from "./documentation/DocsQuickStart";
import DocsLicense from "./documentation/DocsLicense";
import DocsFolderStructure from "./documentation/DocsFolderStructure";
import DocsBuild from "./documentation/DocsBuild";
import DocsChangelog from "./documentation/DocsChangelog";

// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";
import Accordion from "./components/Accordion";
import Alerts from "./components/Alerts";
import Badges from "./components/Badges";
import Breadcrumbs from "./components/Breadcrumbs";
import Buttons from "./components/Buttons";
import Forms from "./components/Forms";
import Modals from "./components/Modals";
import Navs from "./components/Navs";
import Navbars from "./components/Navbars";
import Pagination from "./components/Pagination";
import Popovers from "./components/Popovers";
import Progress from "./components/Progress";
import Tables from "./components/Tables";
import Tabs from "./components/Tabs";
import Tooltips from "./components/Tooltips";
import Toasts from "./components/Toasts";

// API client singleton
import { client } from "../api";

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route
      {...rest}
      render={(props) => (
        <>
          {" "}
          <Preloader show={loaded ? false : true} />
          <Component {...props} />{" "}
        </>
      )}
    />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem("settingsVisible") === "false" ? false : true;
  };

  const [showSettings, setShowSettings] = useState(
    localStorageIsSettingsVisible
  );

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem("settingsVisible", !showSettings);
  };

  return (
    <Route
      {...rest}
      render={(props) => (
        <>
          <Preloader show={loaded ? false : true} />
          <Sidebar />

          <main className="content">
            <Navbar />
            <Component {...props} />
            <Footer
              toggleSettings={toggleSettings}
              showSettings={showSettings}
            />
          </main>
        </>
      )}
    />
  );
};

export const UserContext = createContext(undefined);
// Home app page (provides conditional page rendering via routes)
const HomePage = () => {
  const history = useHistory();
  // Global authentication user React state
  const [user, setUser] = useState(undefined);
  // - undefined - is not determined yet
  // - null - determined is not authenticated
  // - object - determined is authenticated

  const [token, setToken] = useState(localStorage.getItem("token"));
  // - null - not in local storage
  // - string - set in local storage

  // Runs on local storage change
  const handleStorageChange = (e) => {
    setToken(localStorage.getItem("token"));
    console.log("Handle storage event");
  };

  // Constructor (runs on the first render)
  // Destructor/cleanup (runs on the last render)
  useEffect(() => {
    // Constructor
    window.addEventListener("storage", handleStorageChange); // doesn't work
    console.log("Storage listener added");

    return () => {
      // Destructor
      window.removeEventListener("storage", handleStorageChange);
      console.log("Storage listener removed");
    };
  }, []);

  // Runs first time + every time when token changes (update user state based on token)
  useEffect(() => {
    if (token === null) {
      setUser(null);
    } else {
      const fetchUser = async () => {
        // Try to fetch user
        try {
          const authenticatedUser = await client.getMe();
          console.log("User fetched:", authenticatedUser);
          setUser(authenticatedUser);

          // Redirect to the dashboard after token change (startup or authentication)
          history.push("/dashboard/overview");
        } catch (e) {
          // Handle API errors
          console.log(
            `Error while fetching authenticated user (${e.message})!`
          );
          // If fetching not succeeded (user is not determined)
          setUser(null);
        }
      };
      // Fetching will be executed asynchronously
      fetchUser();
    }
  }, [token]);

  //
  // Conditional rendering & routing (authorization)
  //

  // User is not fetching (authenticated state is being determined)
  if (user === undefined) {
    return <Preloader show={true} />;
  }

  // User is not authenticated
  if (user === null) {
    return (
      <Switch>
        <RouteWithLoader
          exact
          path={Routes.Signin.path}
          component={() => <Signin setToken={setToken} />}
        />
        <RouteWithLoader exact path={Routes.Signup.path} component={Signup} />
        <RouteWithLoader
          exact
          path={Routes.ForgotPassword.path}
          component={ForgotPassword}
        />
        <RouteWithLoader
          exact
          path={Routes.ResetPassword.path}
          component={ResetPassword}
        />
        <RouteWithLoader exact path={Routes.Lock.path} component={Lock} />

        <Redirect to={Routes.Signin.path} />
      </Switch>
    );
  }

  return (
    <UserContext.Provider value={user}>
      <Switch>
        <RouteWithLoader
          exact
          path={Routes.Presentation.path}
          component={Presentation}
        />

        {/* Error pages */}
        <RouteWithLoader
          exact
          path={Routes.NotFound.path}
          component={NotFoundPage}
        />
        <RouteWithLoader
          exact
          path={Routes.ServerError.path}
          component={ServerError}
        />

        {/* pages */}
        <RouteWithSidebar
          exact
          path={Routes.DashboardOverview.path}
          component={DashboardOverview}
        />
        {/* <RouteWithSidebar
          exact
          path={Routes.Upgrade.path}
          component={Upgrade}
        /> */}
        <RouteWithSidebar
          exact
          path={Routes.Transactions.path}
          component={Transactions}
        />
        <RouteWithSidebar exact path={Routes.Links.path} component={Links} />
        <RouteWithSidebar
          exact
          path={Routes.Settings.path}
          component={Settings}
        />
        <RouteWithSidebar
          exact
          path={Routes.BootstrapTables.path}
          component={BootstrapTables}
        />

        {/* components */}
        <RouteWithSidebar
          exact
          path={Routes.Accordions.path}
          component={Accordion}
        />
        <RouteWithSidebar exact path={Routes.Alerts.path} component={Alerts} />
        <RouteWithSidebar exact path={Routes.Badges.path} component={Badges} />
        <RouteWithSidebar
          exact
          path={Routes.Breadcrumbs.path}
          component={Breadcrumbs}
        />
        <RouteWithSidebar
          exact
          path={Routes.Buttons.path}
          component={Buttons}
        />
        <RouteWithSidebar exact path={Routes.Forms.path} component={Forms} />
        <RouteWithSidebar exact path={Routes.Modals.path} component={Modals} />
        <RouteWithSidebar exact path={Routes.Navs.path} component={Navs} />
        <RouteWithSidebar
          exact
          path={Routes.Navbars.path}
          component={Navbars}
        />
        <RouteWithSidebar
          exact
          path={Routes.Pagination.path}
          component={Pagination}
        />
        <RouteWithSidebar
          exact
          path={Routes.Popovers.path}
          component={Popovers}
        />
        <RouteWithSidebar
          exact
          path={Routes.Progress.path}
          component={Progress}
        />
        <RouteWithSidebar exact path={Routes.Tables.path} component={Tables} />
        <RouteWithSidebar exact path={Routes.Tabs.path} component={Tabs} />
        <RouteWithSidebar
          exact
          path={Routes.Tooltips.path}
          component={Tooltips}
        />
        <RouteWithSidebar exact path={Routes.Toasts.path} component={Toasts} />

        {/* documentation */}
        <RouteWithSidebar
          exact
          path={Routes.DocsOverview.path}
          component={DocsOverview}
        />
        <RouteWithSidebar
          exact
          path={Routes.DocsDownload.path}
          component={DocsDownload}
        />
        <RouteWithSidebar
          exact
          path={Routes.DocsQuickStart.path}
          component={DocsQuickStart}
        />
        <RouteWithSidebar
          exact
          path={Routes.DocsLicense.path}
          component={DocsLicense}
        />
        <RouteWithSidebar
          exact
          path={Routes.DocsFolderStructure.path}
          component={DocsFolderStructure}
        />
        <RouteWithSidebar
          exact
          path={Routes.DocsBuild.path}
          component={DocsBuild}
        />
        <RouteWithSidebar
          exact
          path={Routes.DocsChangelog.path}
          component={DocsChangelog}
        />
        <Redirect to={Routes.NotFound.path} />
      </Switch>
    </UserContext.Provider>
  );
};

export default HomePage;
