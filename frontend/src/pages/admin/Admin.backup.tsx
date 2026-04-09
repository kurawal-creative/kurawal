"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import { useState } from "react";
import { type SerializedEditorState } from "lexical";

import { Editor } from "@/components/blocks/editor-x/editor";

const initialValue = {
	root: {
		children: [
			{
				children: [
					{
						detail: 0,
						format: 0,
						mode: "normal",
						style: "",
						text: "Hello World 🚀",
						type: "text",
						version: 1,
					},
				],
				direction: "ltr",
				format: "",
				indent: 0,
				type: "paragraph",
				version: 1,
			},
		],
		direction: "ltr",
		format: "",
		indent: 0,
		type: "root",
		version: 1,
	},
} as unknown as SerializedEditorState;

export default function Admin() {
	const [editorState, setEditorState] = useState<SerializedEditorState>(initialValue);
	return (
		<AdminLayout>
			<Editor editorSerializedState={editorState} onSerializedChange={(value) => setEditorState(value)} />
			<div className="space-y-4 pb-8">
				<h1 className="text-3xl font-bold">Dashboard Admin</h1>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div className="rounded-lg border p-6">
						<h3 className="text-lg font-semibold">Total Users</h3>
						<p className="mt-2 text-3xl font-bold">1,234</p>
					</div>
					<div className="rounded-lg border p-6">
						<h3 className="text-lg font-semibold">Total Orders</h3>
						<p className="mt-2 text-3xl font-bold">567</p>
					</div>
					<div className="rounded-lg border p-6">
						<h3 className="text-lg font-semibold">Revenue</h3>
						<p className="mt-2 text-3xl font-bold">$89,000</p>
					</div>
				</div>

				<div className="space-y-4">
					{Array.from({ length: 20 }).map((_, i) => (
						<div key={i} className="rounded-lg border p-4">
							<h3 className="font-semibold">Item #{i + 1}</h3>
							<p className="text-gray-600">This is dummy content item {i + 1}</p>
						</div>
					))}
				</div>
			</div>
		</AdminLayout>
	);
}
