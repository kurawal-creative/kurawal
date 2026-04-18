import { useState, useEffect } from "react";
import AdminLayout from "@/layouts/adminLayout";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type User = {
	id: string;
	email: string;
	name: string;
	role: string;
	banned?: boolean;
	banReason?: string;
	createdAt: Date;
};

export default function Users() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [status, setStatus] = useState<string | null>(null);

	const [newUser, setNewUser] = useState<{ email: string; password: string; name: string; role: "user" | "admin" }>({
		email: "",
		password: "",
		name: "",
		role: "user",
	});

	const updateStatus = (msg: string) => {
		setStatus(msg);
		setTimeout(() => setStatus(null), 3000);
	};

	const fetchUsers = async () => {
		setLoading(true);
		setStatus("FETCHING...");
		try {
			const res = await authClient.admin.listUsers({
				query: { limit: 100 },
			});
			if (res.data) {
				setUsers(res.data.users as User[]);
				setStatus("OK");
			}
		} catch (error: any) {
			setStatus("ERR");
			toast.error("FAILED TO FETCH USERS: " + error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleCreateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("CREATING...");
		try {
			await authClient.admin.createUser(newUser);
			updateStatus("DONE");
			toast.success("USER CREATED");
			setShowCreateModal(false);
			fetchUsers();
		} catch (error: any) {
			updateStatus("FAIL");
			toast.error(error.message);
		}
	};

	const handleBanUser = async (userId: string) => {
		const reason = window.prompt("REASON?");
		if (reason === null) return;
		setStatus("BANNING...");
		try {
			await authClient.admin.banUser({ userId, banReason: reason });
			updateStatus("BANNED");
			toast.success("USER BANNED");
			fetchUsers();
		} catch (error: any) {
			updateStatus("FAIL");
			toast.error(error.message);
		}
	};

	const handleUnbanUser = async (userId: string) => {
		setStatus("UNBANNING...");
		try {
			await authClient.admin.unbanUser({ userId });
			updateStatus("ACTIVE");
			toast.success("USER UNBANNED");
			fetchUsers();
		} catch (error: any) {
			updateStatus("FAIL");
			toast.error(error.message);
		}
	};

	const handleDeleteUser = async (userId: string) => {
		if (!window.confirm("DELETE?")) return;
		setStatus("DELETING...");
		try {
			await authClient.admin.removeUser({ userId });
			updateStatus("REMOVED");
			toast.success("USER REMOVED");
			fetchUsers();
		} catch (error: any) {
			updateStatus("FAIL");
			toast.error(error.message);
		}
	};

	const handleSetRole = async (userId: string, currentRole: string) => {
		const newRole = currentRole === "admin" ? "user" : "admin";
		setStatus("UPDATING...");
		try {
			await authClient.admin.setRole({ userId, role: newRole });
			updateStatus("ROLE_OK");
			toast.success(`ROLE UPDATED TO ${newRole.toUpperCase()}`);
			fetchUsers();
		} catch (error: any) {
			updateStatus("FAIL");
			toast.error(error.message);
		}
	};

	return (
		<AdminLayout>
			<div className="p-4">
				<header className="mb-4 flex items-center justify-between border-b border-black pb-2 text-sm">
					<div className="flex items-center gap-2">
						<h1 className="text-base font-bold uppercase">User Management</h1>
						{status && <span className="bg-black px-2 py-0.5 text-[10px] text-white uppercase">{status}</span>}
					</div>
					<button onClick={() => setShowCreateModal(true)} className="border border-black px-3 py-1 font-medium hover:bg-black hover:text-white">
						+ CREATE
					</button>
				</header>

				<section className="border border-black bg-white">
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm uppercase">
							<thead>
								<tr className="border-b border-black bg-gray-50 font-bold">
									<th className="border-r border-black p-2">ID</th>
									<th className="border-r border-black p-2">Account</th>
									<th className="border-r border-black p-2 text-center">Role</th>
									<th className="border-r border-black p-2 text-center">Stat</th>
									<th className="p-2 text-center">Cmd</th>
								</tr>
							</thead>
							<tbody>
								{loading && users.length === 0 ? (
									<tr>
										<td colSpan={5} className="p-8 text-center text-sm">
											... ACCESS_DB ...
										</td>
									</tr>
								) : users.length === 0 ? (
									<tr>
										<td colSpan={5} className="p-8 text-center text-sm text-gray-400">
											--- NO_DATA ---
										</td>
									</tr>
								) : (
									users.map((user) => (
										<tr key={user.id} className="border-b border-black last:border-b-0 hover:bg-gray-50/50">
											<td className="border-r border-black p-2 text-xs text-nowrap text-gray-400">{user.id.substring(0, 6)}</td>
											<td className="border-r border-black p-2">
												<div className="leading-tight font-bold">{user.name}</div>
												<div className="text-[11px] leading-tight text-gray-500 lowercase">{user.email}</div>
											</td>
											<td className="border-r border-black p-2 text-center">
												<button onClick={() => handleSetRole(user.id, user.role)} className={`border px-2 py-0.5 text-[11px] font-bold ${user.role === "admin" ? "bg-black text-white" : "border-black"}`}>
													{user.role}
												</button>
											</td>
											<td className="border-r border-black p-2 text-center text-[11px]">{user.banned ? <span className="font-bold text-red-600 underline">BAN</span> : "OK"}</td>
											<td className="p-2">
												<div className="flex justify-center gap-2">
													{user.banned ? (
														<button onClick={() => handleUnbanUser(user.id)} className="border border-black bg-green-50 px-2 py-0.5 text-[10px] font-bold">
															ACT
														</button>
													) : (
														<button onClick={() => handleBanUser(user.id)} className="border border-black bg-red-50 px-2 py-0.5 text-[10px] font-bold">
															BAN
														</button>
													)}
													<button onClick={() => handleDeleteUser(user.id)} className="border border-black px-2 py-0.5 text-[10px] font-bold hover:bg-black hover:text-white">
														DEL
													</button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</section>

				{showCreateModal && (
					<div className="fixed inset-0 flex items-center justify-center bg-black/20 p-4">
						<div className="w-80 border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
							<div className="mb-6 border-b border-black pb-2 text-sm font-bold uppercase">New User Data</div>
							<form onSubmit={handleCreateUser} className="space-y-4">
								<div className="space-y-1">
									<label className="text-[10px] font-bold">NAME</label>
									<input required className="w-full border border-black p-2 text-sm ring-black outline-none focus:ring-1" onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
								</div>
								<div className="space-y-1">
									<label className="text-[10px] font-bold">EMAIL</label>
									<input required type="email" className="w-full border border-black p-2 text-sm ring-black outline-none focus:ring-1" onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
								</div>
								<div className="space-y-1">
									<label className="text-[10px] font-bold">PASSWORD</label>
									<input required type="password" className="w-full border border-black p-2 text-sm ring-black outline-none focus:ring-1" onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
								</div>
								<div className="space-y-1">
									<label className="text-[10px] font-bold">ROLE</label>
									<select className="w-full appearance-none border border-black bg-white p-2 text-sm ring-black outline-none focus:ring-1" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "user" | "admin" })}>
										<option value="user">USER</option>
										<option value="admin">ADMIN</option>
									</select>
								</div>
								<div className="flex gap-2 pt-2 text-xs font-bold uppercase">
									<button type="submit" className="flex-1 bg-black py-2 text-white">
										Save
									</button>
									<button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 border border-black py-2 hover:bg-gray-100">
										Exit
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</AdminLayout>
	);
}
