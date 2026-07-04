// import Welcome from "./components/Welcome";
import NavBar from "./components/NavBar";
import CompanyCard from "./components/CompanyCard";
import JobCard from "./components/JobCard";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";
import Login from "./pages/login";
import {useEffect,useState} from "react";
import { getCompanies,updateCompany,deleteCompany,createCompany } from "./Services/CompanyService";
import type {Company} from "./types/company"

function App(){
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<Error | null>(null)
  const [companies,setCompanies] = useState<Company[]>([]);
  const [isAuthenticated,setIsAuthenticated] = useState(() => Boolean(localStorage.getItem("token")));

  const handleLogin = (token: string) => {
    if (token) {
      localStorage.setItem("token", token);
    }
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

  async function handleEdit(company:Company){
    try{
      const updatedCompany = await updateCompany(company.id,company);
      setCompanies(companies.map((company) => company.id === updatedCompany.id ? updatedCompany : company));
    }catch(err: unknown){
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }

  async function handleDelete(id:number){
    try{
      await deleteCompany(id);
      setCompanies(companies.filter((company) => company.id !== id));
    }catch(err: unknown){
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }

  async function handleAdd(company:Company){
    try{
      const newCompany = await createCompany(company);
      setCompanies([...companies,newCompany]);
    }catch(err: unknown){
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
  
  if(loading){
    return <div>Loading...</div>
  }

  if(error){
    return <div>Error: {error.message}</div>
  }

  if(!isAuthenticated){
    return (
      <div style={{ maxWidth: "420px", margin: "3rem auto", padding: "1rem" }}>
        <Login onLogin={handleLogin} onSwitchToRegister={() => {}} />
      </div>
    );
  }
  
  return(
    <>
    <NavBar />
    {/* <Welcome /> */}
    <br />
    <CompanyCard 
    companies={companies}
    onedit={handleEdit}
    ondelete={handleDelete}
    onadd={handleAdd}
    />
    <JobCard />
    <Chatbot />
    <Footer />
    </>
  )
}

export default App