import { create } from "zustand";
import { getListMedia, deleteMedia } from "@/helpers/media";
import type { Media } from "@/helpers/media";

type MediaState = {
	byId: Record<string, Media>;
	ids: string[];
	loading: boolean;
	error?: string;
	page: number;
	limit: number;
	hasNextPage: boolean;
	initialized: boolean;
	inFlight?: Promise<void>;

	// actions
	fetch: (opts?: { page?: number; limit?: number; reset?: boolean; force?: boolean }) => Promise<void>;
	refresh: () => Promise<void>;
	removeByPublicId: (publicId: string) => Promise<void>;
	setMany: (list: Media[], reset?: boolean) => void;
};

const useMediaStore = create<MediaState>()((set, get) => ({
	byId: {},
	ids: [],
	loading: false,
	error: undefined,
	page: 1,
	limit: 10,
	hasNextPage: false,
	initialized: false,
	inFlight: undefined,

	setMany: (list, reset = false) =>
		set((state) => {
			const byId = reset ? {} : { ...state.byId };
			let ids = reset ? [] : state.ids.slice();

			for (const m of list) {
				byId[m._id] = m;
				if (!ids.includes(m._id)) ids.push(m._id);
			}
			return { byId, ids, initialized: true };
		}),

	fetch: async (opts) => {
		const state = get();
		const page = opts?.page ?? state.page;
		const limit = opts?.limit ?? state.limit;
		const reset = opts?.reset ?? false;
		const force = opts?.force ?? false;

		// de-dup request in-flight untuk efisiensi
		if (!force && state.inFlight) {
			await state.inFlight;
			return;
		}

		const p = (async () => {
			set({ loading: true, error: undefined });
			try {
				const res = await getListMedia(page, limit);
				get().setMany(res.media, reset);
				set({
					page,
					limit,
					hasNextPage: res.pagination.hasNextPage,
				});
			} catch (e: any) {
				set({ error: e?.message ?? "Failed to fetch media" });
			} finally {
				set({ loading: false, inFlight: undefined });
			}
		})();

		set({ inFlight: p });
		await p;
	},

	refresh: async () => {
		await get().fetch({ page: 1, reset: true, force: true });
	},

	removeByPublicId: async (publicId: string) => {
		try {
			await deleteMedia(publicId);
		} finally {
			set((state) => {
				// cari id berdasarkan publicId
				const id = state.ids.find((x) => state.byId[x]?.publicId === publicId);
				if (!id) return {};
				const byId = { ...state.byId };
				delete byId[id];
				return { byId, ids: state.ids.filter((x) => x !== id) };
			});
		}
	},
}));

export default useMediaStore;
