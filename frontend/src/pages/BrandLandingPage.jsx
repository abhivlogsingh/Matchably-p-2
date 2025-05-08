/** @format */

import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Devider from '../components/Devider';

const BrandLandingPage = () => {
	const features = [
		'Campaign starts within 24 hours',
		'Access to 20+ authentic UGC pieces per campaign',
		'No complicated dashboards; simple email process',
		'Only $500 to start a campaign',
	];

	return (
		<div className='bg-black text-white'>
			{/* SEO */}
			<Helmet>
				<title>Matchably</title>
				<meta
					property='og:title'
					content='Get Free Products. Make Content. Get Rewarded.'
				/>
				<meta
					name='description'
					content='Connect with real creators, get authentic UGC content, and expand your brand with real results—without the high costs.'
				/>
			</Helmet>

			{/* Hero Section */}
			<section className='flex flex-col items-center justify-center text-center py-20 px-4'>
				<h1 className='text-3xl md:text-5xl font-bold mb-4'>
				  Launch Your UGC Campaign — Fast, Authentic, and Affordable.
				</h1>
				<p className='text-lg md:text-2xl mb-8 leading-relaxed'>
				Connect with real creators and get impactful user-generated content that builds trust and drives results.
				</p>
				<Link to='/campaigns'><a				
					className='relative group inline-block px-10 py-5 text-lg font-semibold rounded-xl bg-gradient-to-r from-green-400 to-blue-400 text-black transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_30px_#00ffcc] hover:from-green-300 hover:to-blue-300'
				>
					<span className='absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-r from-green-400 to-blue-400 z-[-1]'></span>
					🚀 Launch Your Campaign
				</a>
				</Link>
			</section>
			<Devider />

			{/* Comparison Section */}
			<section className='py-20 px-4 max-w-5xl mx-auto'>
				<h2 className='text-3xl font-bold text-center mb-8'>
					Why Brands Choose Matchably
				</h2>
				<div className='overflow-x-auto'>
					<table className='min-w-full border-collapse'>
						<thead>
							<tr className='border-b border-gray-700'>
								<th className='py-4 text-left text-lg font-semibold'>
									Feature
								</th>
								<th className='py-4 text-center text-lg font-semibold'>
									Matchably
								</th>
								<th className='py-4 text-center text-lg font-semibold'>
									Traditional Platforms
								</th>
							</tr>
						</thead>
						<tbody>
							{features.map((text, idx) => (
								<tr
									key={idx}
									className='border-b border-gray-800'
								>
									<td className='py-4 text-[18px] leading-relaxed'>{text}</td>
									<td className='py-4 text-lg text-center text-green-400'>✅</td>
									<td className='py-4 text-lg text-center text-red-500'>❌</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
			<Devider />

			{/* Why Consumers Trust UGC */}
<section className='py-20 px-4 bg-black text-white'>
  <h2 className='text-3xl font-bold text-center mb-12'>
    Why Today’s Consumers Trust UGC
  </h2>
  <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto'>
    {[
      {
        icon: '🧠',
        headline: '86% Trust UGC Over Influencers',
        desc: 'Consumers trust brands more when they use content from real customers instead of paid influencers.',
        source: '— EnTribe, 2023',
      },
      {
        icon: '🛍️',
        headline: '83% More Likely to Buy',
        desc: 'Real customer UGC makes 83% of people more likely to purchase than influencer-created content.',
        source: '— EnTribe, 2023',
      },
      {
        icon: '📊',
        headline: '9.8x More Impactful',
        desc: 'UGC is 9.8x more powerful than influencer content in driving purchase decisions.',
        source: '— Nielsen / Stackla Report',
      },
      {
        icon: '🚀',
        headline: '50% Higher Brand Lift',
        desc: 'UGC campaigns drive up to 50% higher brand awareness and recall than branded ads.',
        source: '— Ipsos & Meta Study',
      },
    ].map((card, idx) => (
      <div
        key={idx}
        className='p-6 bg-black border border-gray-700 rounded-xl shadow-lg transition-all hover:scale-105 hover:border-blue-400 hover:shadow-blue-500/40'
      >
        <div className='text-4xl mb-3'>{card.icon}</div>
        <h3 className='text-xl font-bold text-green-400 mb-2'>{card.headline}</h3>
        <p className='text-base text-gray-300 mb-2'>{card.desc}</p>
        <p className='text-sm text-gray-500 italic'>{card.source}</p>
      </div>
    ))}
  </div>
</section>


			{/* How It Works */}
			<section className='py-20 px-4 bg-[var(--background)]'>
				<h2 className='text-3xl font-bold text-center mb-12'>How It Works</h2>
				<div className='flex flex-col md:flex-row items-stretch md:justify-between max-w-5xl mx-auto gap-8'>
					{[
						{
							icon: '✉️',
							title: 'Send Your Campaign by Email',
							desc: 'Share product info, target audience, and timeline.',
						},
						{
							icon: '🚀',
							title: 'We Launch Your Campaign',
							desc: 'Your campaign is posted to our creator network.',
						},
						{
							icon: '📸',
							title: 'Receive Authentic UGC',
							desc: 'Creators apply, receive products, and deliver content.',
						},
					].map((step, i) => (
						<div
							key={i}
							className='flex flex-col items-center text-center p-6 rounded-xl border border-gray-700 bg-black shadow-lg flex-1 transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:shadow-blue-500/40'
							style={{ minHeight: '280px' }}
						>
							<div className='text-5xl mb-4'>{step.icon}</div>
							<h3 className='text-xl font-bold mb-2'>{step.title}</h3>
							<p className='text-base text-gray-300'>{step.desc}</p>
						</div>
					))}
				</div>
			</section>

			<Devider />

			{/* Pricing Section */}
			<section className='py-15 px-4 max-w-2xl mx-auto text-center'>
				<h2 className='text-5xl font-bold mb-6'>Pricing</h2>
				<p className='text-3xl font-extrabold text-green-400 mb-2'>$500</p>
				<p className='text-lg font-medium mb-2'>Simple and straightforward.</p>
				<p className='text-sm text-gray-400'>Most brands start here.</p>
			</section>
			<Devider />

			{/* Final CTA */}
			<section className='py-20 px-4 text-center bg-gradient-to-r from-black to-[#040014]'>
				<h2 className='text-4xl md:text-5xl font-bold mb-15 text-white transition-all duration-300 hover:tracking-wider'>
					Ready to Launch?
				</h2>

				<a
					href='mailto:info@matchably.kr'
					className='inline-block px-10 py-5 text-lg font-semibold rounded-lg bg-gradient-to-r from-green-400 to-blue-400 text-black shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-[0_0_25px_#00ffff] hover:-translate-y-1'
				>
					📩 Email us at: <span className='font-bold'>info@matchably.kr</span>
				</a>
			</section>
		</div>
	);
};

export default BrandLandingPage;
