import { useEffect, useState } from "react";
import { createJob, deleteJob, getJobs, updateJob } from "../Services/JobService";
import type { Job } from "../types/job";

const emptyJob = (): Job => ({
    id: 0,
    title: "",
    description: "",
    location: "",
    salary: 0,
    company_id: 0,
});

function JobCard() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editJobId, setEditJobId] = useState<number | null>(null);
    const [addForm, setAddForm] = useState<Job>(emptyJob());
    const [editForm, setEditForm] = useState<Job>(emptyJob());

    const resetAddForm = () => setAddForm(emptyJob());
    const resetEditForm = () => setEditForm(emptyJob());

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const allJobs = await getJobs();
            setJobs(Array.isArray(allJobs) ? allJobs : []);
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
            setError("Unable to load jobs right now.");
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchJobs();
    }, []);

    const handleAdd = async () => {
        try {
            const createdJob = await createJob(addForm);
            setJobs((prev) => [createdJob, ...prev]);
            resetAddForm();
            setError(null);
        } catch (err) {
            console.error("Failed to create job:", err);
            setError("Unable to create job.");
        }
    };

    const handleSave = async () => {
        if (editJobId === null) return;
        try {
            const updatedJob = await updateJob(editJobId, editForm);
            setJobs((prev) => prev.map((job) => (job.id === updatedJob.id ? updatedJob : job)));
            setEditJobId(null);
            resetEditForm();
            setError(null);
        } catch (err) {
            console.error("Failed to update job:", err);
            setError("Unable to update job.");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteJob(String(id));
            setJobs((prev) => prev.filter((job) => job.id !== id));
            if (editJobId === id) {
                setEditJobId(null);
                resetEditForm();
            }
            setError(null);
        } catch (err) {
            console.error("Failed to delete job:", err);
            setError("Unable to delete job.");
        }
    };

    const startEdit = (job: Job) => {
        setEditJobId(job.id);
        setEditForm(job);
    };

    if (loading) {
        return <div className="page-container"><p className="small-text">Loading jobs...</p></div>;
    }

    return (
        <div className="job-container">
            {error ? <p className="small-text error-text">{error}</p> : null}

            {jobs.length === 0 ? (
                <p className="small-text">No jobs found right now.</p>
            ) : (
                jobs.map((job) => (
                    <div key={job.id} className="job-card">
                        {editJobId === job.id ? (
                            <div className="job-form">
                                <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" />
                                <input type="text" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" />
                                <input type="text" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} placeholder="Location" />
                                <input type="number" value={editForm.salary} onChange={(e) => setEditForm({ ...editForm, salary: Number(e.target.value) })} placeholder="Salary" />
                                <input type="number" value={editForm.company_id} onChange={(e) => setEditForm({ ...editForm, company_id: Number(e.target.value) })} placeholder="Company ID" />
                                <div className="job-actions">
                                    <button onClick={handleSave}>Save</button>
                                    <button onClick={() => { setEditJobId(null); resetEditForm(); }}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2>{job.title}</h2>
                                <p>{job.description}</p>
                                <div className="skills">
                                    <span className="skill">{job.location}</span>
                                    <span className="skill">₹{job.salary}</span>
                                </div>
                            </div>
                        )}

                        <div className="job-actions">
                            <button onClick={() => (editJobId === job.id ? (setEditJobId(null), resetEditForm()) : startEdit(job))}>
                                {editJobId === job.id ? "Cancel" : "Edit"}
                            </button>
                            <button className="delete-btn" onClick={() => void handleDelete(job.id)}>Delete</button>
                        </div>
                    </div>
                ))
            )}

            <div className="card add-company-card">
                <h2>Add Job</h2>
                <div className="job-form">
                    <input type="text" value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} placeholder="Title" />
                    <input type="text" value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} placeholder="Description" />
                    <input type="text" value={addForm.location} onChange={(e) => setAddForm({ ...addForm, location: e.target.value })} placeholder="Location" />
                    <input type="number" value={addForm.salary} onChange={(e) => setAddForm({ ...addForm, salary: Number(e.target.value) })} placeholder="Salary" />
                    <input type="number" value={addForm.company_id} onChange={(e) => setAddForm({ ...addForm, company_id: Number(e.target.value) })} placeholder="Company ID" />
                    <button onClick={handleAdd}>Add Job</button>
                </div>
            </div>
        </div>
    );
}

export default JobCard;