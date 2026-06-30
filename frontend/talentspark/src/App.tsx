import Welcome from './components/Welcome';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import CompanyCard from './components/CompanyCard';
import JobCard from './components/JobCard';
import type {Company} from "./types/company";
import {useEffect, useState} from "react";
import {getCompanies} from "./Services/CompanyService";

function App() {
  const[loading, setLoading] = useState(true);
  const[error, setError] = useState<Error | null>(null);
  const[companies, setCompanies] = useState<Company[]>([]);

  async function fetchCompanies() {
    setLoading(true);
    try{
      const data = await getCompanies();
      setCompanies(data);

    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchCompanies();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div>
      <Navbar />
      <Welcome /> <br />
      <CompanyCard companies={companies} />
      <JobCard />
      <Footer />
    </div>
  );
}

export default App;