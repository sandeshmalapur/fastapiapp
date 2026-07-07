import type { Company } from "../types/company";
import { useState } from "react";

type Props = {
    companies: Company[];
    onedit: (company: Company) => void;
    ondelete: (id: number) => void;
    onadd: (company: Company) => void;
}

const emptyCompany = (): Company => ({
    id: 0,
    name: "",
    email: "",
    phone: "",
    location: "",
    jobs: [],
});

function CompanyCard({ companies, onadd, onedit, ondelete }: Props) {
    const [editCompanyId, setEditCompanyId] = useState<number | null>(null);
    const [addform, setAddform] = useState<Company>(emptyCompany());
    const [editform, setEditform] = useState<Company>(emptyCompany());

    const handleAdd = () => {
        onadd(addform);
        setAddform(emptyCompany());
    };

    const handleSave = () => {
        onedit(editform);
        setEditform(emptyCompany());
    };

    const handlecancel = () => {
        setEditCompanyId(null);
        setEditform(emptyCompany());
    };

    return (
        <div className="company-container">
            {companies.map((company) => (
                <div key={company.id} className="company-card">
                    {editCompanyId === company.id ? (
                        <div className="job-form">
                            <input type="text" value={editform.name} onChange={(e) => setEditform({ ...editform, name: e.target.value })} placeholder={company.name} />
                            <input type="text" value={editform.email} onChange={(e) => setEditform({ ...editform, email: e.target.value })} placeholder={company.email} />
                            <input type="text" value={editform.phone} onChange={(e) => setEditform({ ...editform, phone: e.target.value })} placeholder={company.phone} />
                            <input type="text" value={editform.location} onChange={(e) => setEditform({ ...editform, location: e.target.value })} placeholder={company.location} />
                            <div className="job-actions">
                                <button onClick={handleSave}>Save</button>
                                <button onClick={handlecancel}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2>{company.name}</h2>
                            <p>{company.email}</p>
                            <p>{company.phone}</p>
                            <p>{company.location}</p>
                            {company.jobs.length > 0 && (
                                <div className="skills">
                                    {company.jobs.map((job, i) => (
                                        <span key={i} className="skill">{job.title}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="job-actions">
                        <button
                            onClick={() => {
                                setEditCompanyId(company.id);
                                setEditform({ ...company, jobs: [] });
                            }}
                        >
                            Edit
                        </button>
                        <button className="delete-btn" onClick={() => ondelete(company.id)}>
                            Delete
                        </button>
                    </div>
                </div>
            ))}

            <div className="card add-company-card">
                <h2>Add Company</h2>
                <div className="job-form">
                    <input type="text" value={addform.name} onChange={(e) => setAddform({ ...addform, name: e.target.value })} placeholder="Company name" />
                    <input type="text" value={addform.email} onChange={(e) => setAddform({ ...addform, email: e.target.value })} placeholder="Email" />
                    <input type="text" value={addform.phone} onChange={(e) => setAddform({ ...addform, phone: e.target.value })} placeholder="Phone" />
                    <input type="text" value={addform.location} onChange={(e) => setAddform({ ...addform, location: e.target.value })} placeholder="Location" />
                    <button onClick={handleAdd}>Add Company</button>
                </div>
            </div>
        </div>
    );
}

export default CompanyCard;