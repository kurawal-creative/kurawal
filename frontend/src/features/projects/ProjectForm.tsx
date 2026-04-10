import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "@/utils/api";

export default function ProjectForm() {
	const { id } = useParams();
	const isEdit = !!id;
	const navigate = useNavigate();
	const [loading, setLoading] = useState(isEdit);
	
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		link_github: "",
		link_demo: "",
		status: "Preview",
		env: ""
	});

	useEffect(() => {
		if (isEdit) {
			const fetchProject = async () => {
				try {
					const response = await api.get(`/projects/${id}`);
					const { name, description, link_github, link_demo, status, env } = response.data;
					setFormData({
						name: name || "",
						description: description || "",
						link_github: link_github || "",
						link_demo: link_demo || "",
						status: status || "Preview",
						env: env || ""
					});
				} catch (error) {
					console.error("Failed to fetch project", error);
					alert("Project not found");
					navigate("/admin/project");
				} finally {
					setLoading(false);
				}
			};
			fetchProject();
		}
	}, [id, isEdit, navigate]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (isEdit) {
				await api.put(`/projects/${id}`, formData);
			} else {
				await api.post("/projects", formData);
			}
			navigate("/admin/project");
		} catch (error) {
			console.error("Failed to save project", error);
			alert("Error saving project");
		}
	};

	if (loading) return <div className="p-4">LOADING FORM...</div>;

	return (
		<div className="p-4 uppercase tracking-tighter">
			<div className="flex justify-between items-center mb-6 border-b border-black pb-2">
				<h1 className="text-xl font-bold">Project / {isEdit ? `Edit / ${id}` : "Create New"}</h1>
				<Link to="/admin/project" className="border border-black px-4 py-1 hover:bg-gray-100">
					Cancel and Return
				</Link>
			</div>

			<form onSubmit={handleSave} className="border border-black p-4 space-y-6">
				<div className="space-y-4">
					<div className="flex flex-col gap-2">
						<label className="text-sm font-bold opacity-50">Project Name</label>
						<input 
							type="text" 
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="Project Name..." 
							className="border-b border-black p-2 focus:outline-none focus:bg-gray-50 uppercase" 
							required
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-sm font-bold opacity-50">Description</label>
						<textarea 
							name="description"
							value={formData.description}
							onChange={handleChange}
							placeholder="Project Description..." 
							className="border border-black p-2 focus:outline-none focus:bg-gray-50 h-32 normal-case text-sm"
							required
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-sm font-bold opacity-50">Environment Variables (ENV)</label>
						<textarea 
							name="env"
							value={formData.env}
							onChange={handleChange}
							placeholder="KEY=VALUE&#10;PORT=3000..." 
							className="border border-black p-2 focus:outline-none focus:bg-gray-50 h-32 font-mono text-sm normal-case"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-black pt-4">
						<div className="flex flex-col gap-2">
							<label className="text-sm font-bold opacity-50">GitHub URL</label>
							<input 
								type="text" 
								name="link_github"
								value={formData.link_github}
								onChange={handleChange}
								placeholder="https://github.com/..." 
								className="border-b border-black p-2 focus:outline-none focus:bg-gray-50 normal-case text-sm" 
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-sm font-bold opacity-50">Demo URL</label>
							<input 
								type="text" 
								name="link_demo"
								value={formData.link_demo}
								onChange={handleChange}
								placeholder="https://..." 
								className="border-b border-black p-2 focus:outline-none focus:bg-gray-50 normal-case text-sm" 
							/>
						</div>
					</div>

					<div className="flex flex-col gap-2 w-full md:w-1/3">
						<label className="text-sm font-bold opacity-50">Status</label>
						<select 
							name="status"
							value={formData.status}
							onChange={handleChange}
							className="border border-black p-2 focus:outline-none focus:bg-gray-50 uppercase cursor-pointer text-sm"
						>
							<option value="Production">Production</option>
							<option value="Preview">Preview</option>
							<option value="Archived">Archived</option>
						</select>
					</div>
				</div>

				<div className="mt-8 flex gap-4 pt-6 border-t border-black">
					<button 
						type="submit" 
						className="border border-black px-10 py-3 bg-black text-white hover:bg-gray-800 font-bold"
					>
						{isEdit ? "Update Project" : "Create Project"}
					</button>
					<button 
						type="button"
						onClick={() => navigate("/admin/project")}
						className="border border-black px-10 py-3 hover:bg-gray-100 font-bold"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
