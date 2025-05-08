/** @format */

import axios from 'axios';
import { create } from 'zustand';
import Cookie from 'js-cookie';
import config from '../config';
import { User } from 'lucide-react';

const BACKEND_URL = config.BACKEND_URL;

const useAuthStore = create((set) => ({
	isLogin: false,
	User: {},
	verifyLogin: async () => {
		try {
			const token = Cookie.get('token') || localStorage.getItem('token');
			console.log('✅ VITE_BACKEND_URL =', import.meta.env);
			const res = await axios.get(`${BACKEND_URL}/auth/verify`, {
				headers: {
					Authorization: token, // ✅ capital A
				},
			});

			console.log(res.data);
			set({ isLogin: res.data.status === 'success' });
			if (res.data.status === 'success') {
				set({ User: res.data.user });
			}
		} catch {
			set({ isLogin: false });
		}
	},
	setSignin: async (state) => {
		set({ isLogin: state });
	},
}));

const useCompaign = create((set) => ({
	Campaigns: [],
	setToEmpty: () => set({ Campaigns: [] }),
	EditCampaign: async (index, campaign) => {
		set((state) => {
		  const updatedCampaigns = [...state.Campaigns];
		  updatedCampaigns[index] = {
			...updatedCampaigns[index],
			...campaign,
		  };
		  return { Campaigns: updatedCampaigns };
		});
	  },	  
	DeleteCampaign: async (index) => {
		set((state) => {
			const updatedCampaigns = [...state.Campaigns];
			updatedCampaigns.splice(index, 1);
			return { Campaigns: updatedCampaigns };
		});
	},

	AddCompaign: async ({
		campaignTitle,
		brandName,
		productDescription,
		contentFormat,
		requiredHashtags,
		influencersReceive,
		deadline,
		participationRequirements,
		productImage,
		id,
		brandLogo,
		productImages,
		recruiting,
		campaignIndustry,
	  }) => {
		set((state) => ({
		  Campaigns: [
			...state.Campaigns,
			{
			  campaignTitle,
			  brandName,
			  productDescription,
			  contentFormat,
			  requiredHashtags,
			  influencersReceive,
			  deadline,
			  participationRequirements,
			  productImage,
			  brandLogo,
			  productImages,
			  recruiting,
			  campaignIndustry,
			  id,
			},
		  ],
		}));
	  },	  
	SetCompaigns: async (compaigns) => {
		console.log(compaigns);
		set((state) => ({
			Campaigns: [...state.Campaigns, ...compaigns], // Correctly refer to the state
		}));
	},
}));

export { useCompaign };
export default useAuthStore;
