import { createBrowserRouter, createRoutesFromElements, Navigate,  Route } from "react-router-dom"
import Layout from "./components/Layout"
import AboutMe from "./pages/AboutMe/AboutMe"
import Home from "./pages/Home/Home"
import VacanciesPage from "./pages/Vacancies/VacanciesPage"
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage"


const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<Navigate to="/vacancies/moscow" replace />} />
    <Route path="vacancies/:citySlug" element={<Home />} />
    <Route path="about_me" element={<AboutMe />} />
    <Route path="vacancy/:id" element={<VacanciesPage />} />
    <Route path="*" element={<NotFoundPage/>} />
  </Route>
),
 { basename: "/HH-FE/" }); 

 export { router };