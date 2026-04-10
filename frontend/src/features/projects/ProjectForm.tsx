import { Link, useNavigate, useParams } from "react-router-dom";

export default function ProjectForm() {
	const { id } = useParams();
	const isEdit = !!id;
	const navigate = useNavigate();

	const handleSave = (e: React.FormEvent) => {
		e.preventDefault();
		alert(isEdit ? "Updated Project!" : "Created Project!");
		navigate("/admin/project");
	};

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
							placeholder="Project Name..." 
							className="border-b border-black p-2 focus:outline-none focus:bg-gray-50 uppercase" 
							required
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-sm font-bold opacity-50">Description</label>
						<textarea 
							placeholder="Project Description..." 
							className="border border-black p-2 focus:outline-none focus:bg-gray-50 h-32 normal-case"
							required
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-sm font-bold opacity-50">Environment Variables (ENV)</label>
						<textarea 
							placeholder="KEY=VALUE&#10;PORT=3000..." 
							className="border border-black p-2 focus:outline-none focus:bg-gray-50 h-32 font-mono text-sm normal-case"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<label className="text-sm font-bold opacity-50">GitHub URL</label>
							<input 
								type="text" 
								placeholder="https://github.com/..." 
								className="border-b border-black p-2 focus:outline-none focus:bg-gray-50 normal-case" 
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-sm font-bold opacity-50">Demo URL</label>
							<input 
								type="text" 
								placeholder="https://..." 
								className="border-b border-black p-2 focus:outline-none focus:bg-gray-50 normal-case" 
							/>
						</div>
					</div>

					<div className="flex flex-col gap-2 w-full md:w-1/3">
						<label className="text-sm font-bold opacity-50">Status</label>
						<select className="border border-black p-2 focus:outline-none focus:bg-gray-50 uppercase cursor-pointer">
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
