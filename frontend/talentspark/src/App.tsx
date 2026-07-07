import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import CompanyCard from "./components/CompanyCard";
import JobCard from "./components/JobCard";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";
import Login from "./pages/login";
import JobMatch from "./pages/JobMatch";
import ResumeAnalyser from "./pages/ResumeAnalyser";
import { useEffect, useState } from "react";
import { getCompanies, updateCompany, deleteCompany, createCompany } from "./Services/CompanyService";
import type { Company } from "./types/company";

function App() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem("token")));

    const handleLogin = (token: string) => {
        if (token) localStorage.setItem("token", token);
        setIsAuthenticated(true);
        setError(null);
    };

    async function fetchCompanies() {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const companies = await getCompanies();
            setCompanies(companies);
            setIsAuthenticated(true);
        } catch (err: unknown) {
            setIsAuthenticated(false);
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setLoading(false);
        }
    }

    async function handleEdit(company: Company) {
        try {
            const updatedCompany = await updateCompany(company.id, company);
            setCompanies(companies.map((c) => (c.id === updatedCompany.id ? updatedCompany : c)));
        } catch (err: unknown) {
            setError(err instanceof Error ? err : new Error(String(err)));
        }
    }

    async function handleDelete(id: number) {
        try {
            await deleteCompany(id);
            setCompanies(companies.filter((c) => c.id !== id));
        } catch (err: unknown) {
            setError(err instanceof Error ? err : new Error(String(err)));
        }
    }

    async function handleAdd(company: Company) {
        try {
            const newCompany = await createCompany(company);
            setCompanies([...companies, newCompany]);
        } catch (err: unknown) {
            setError(err instanceof Error ? err : new Error(String(err)));
        }
    }

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        fetchCompanies();
    }, [isAuthenticated]);

    if (loading) {
        return <div className="page-container"><p className="small-text">Loading...</p></div>;
    }

    if (error) {
        return <div className="page-container"><p className="error-text">Error: {error.message}</p></div>;
    }

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} onSwitchToRegister={() => {}} />;
    }

    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" element={<Navigate to="/companies" replace />} />
                <Route
                    path="/companies"
                    element={
                        <CompanyCard
                            companies={companies}
                            onedit={handleEdit}
                            ondelete={handleDelete}
                            onadd={handleAdd}
                        />
                    }
                />
                <Route path="/jobs" element={<JobCard />} />
                <Route path="/job-match" element={<JobMatch />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/resume-analyser" element={<ResumeAnalyser />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;