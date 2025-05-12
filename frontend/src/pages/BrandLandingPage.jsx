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
			<section className='flex flex-col items-center justify-center text-center py-20 px-4 bg-black text-white'>
  {/* Headline */}
  <h1 className='text-3xl md:text-5xl font-bold mb-4'>
    Launch Your UGC Campaign in 7 Days — or Less.
  </h1>

  {/* Subtext */}
  <p className='text-lg md:text-xl mb-8 leading-relaxed text-gray-300'>
    High-quality. Affordable. Hassle-free.
  </p>

  {/* Key Badges as Cards */}
  <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full max-w-5xl'>
    {[
      {
        icon: '💰',
        text: 'Starts from just $199',
      },
      {
        icon: '🎯',
        text: 'Quality Guaranteed (we review and reject poor content)',
      },
      {
        icon: '📧',
        text: 'No complex dashboard — managed via simple email',
      },
    ].map((item, idx) => (
      <div
        key={idx}
        className='flex flex-col items-center text-center p-6 rounded-xl border border-gray-700 bg-[#111] shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:shadow-blue-500/40'
      >
        <div className='text-3xl mb-3'>{item.icon}</div>
        <p className='text-base md:text-lg text-gray-300 font-medium'>{item.text}</p>
      </div>
    ))}
  </div>

  {/* CTA Button */}
  <a
    href='mailto:info@matchably.kr'
    className='relative group inline-block px-10 py-5 text-lg font-semibold rounded-xl bg-gradient-to-r from-green-400 to-blue-400 text-black transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_30px_#00ffcc] hover:from-green-300 hover:to-blue-300'
    aria-label='Start My Campaign'
  >
    <span className='absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-r from-green-400 to-blue-400 z-[-1]'></span>
    🚀 Start My Campaign
  </a>
</section>

			<Devider />

			{/* Comparison Section */}
			<section className='py-20 px-4 max-w-6xl mx-auto'>
  <h2 className='text-3xl md:text-4xl font-bold text-center mb-12'>
    Why Brands Choose Matchably
  </h2>

  <div className='grid gap-8 md:grid-cols-3'>
    {[
      {
        pain: '“The content quality was so poor, I couldn\'t even use it.”',
        solution:
          'Matchably reviews all submissions and requests reshoots if quality is poor.',
      },
      {
        pain: '“It took over a week just to find creators.”',
        solution:
          'We complete creator matching within 7 days, and launch fast.',
      },
      {
        pain: '“I was told it would cost over $1,000 just to start.”',
        solution:
          'Matchably campaigns start from $199, no hidden fees.',
      },
    ].map((item, idx) => (
      <div
        key={idx}
        className='bg-[#111] text-white rounded-xl p-6 shadow-lg border border-gray-700 hover:shadow-[0_0_25px_#00ffcc] transition-all duration-300'
      >
        <p className='text-red-400 text-lg mb-4'>
          ❗ <span className='italic'> {item.pain} </span>
        </p>
        <p className='text-green-400 text-md font-medium'>
          💡 {item.solution}
        </p>
      </div>
    ))}
  </div>

  <p className='text-center mt-12 text-xl md:text-2xl font-semibold text-white'>
    👉 If any of this sounds familiar, <span className='text-green-400'>Matchably is built for you.</span>
  </p>
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
							title: 'Email Us Your Campaign Info',
							desc: 'Just send your product details, quantity of content, and your target audience.',
						},
						{
							icon: '🚀',
							title: 'Creator Matching Within 7 Days',
							desc: 'We select the best creators internally and launch immediately.',
						},
						{
							icon: '📸',
							title: 'Receive High-Quality, Reviewed Content',
							desc: 'Only approved content is delivered. We reject anything that doesn’t meet our standard.',
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
			<section className='py-20 px-4 max-w-6xl mx-auto text-center'>
  <h2 className='text-4xl md:text-5xl font-bold mb-12'>What Our Clients Say</h2>

  <div className='grid md:grid-cols-2 gap-8'>
    {[
      {
        quote:
          'Can’t believe we got this level of content for just $199.',
        author: '— Marketing Manager, Skincare Co.',
      },
      {
        quote:
          'First time working with a platform that actually rejects low-quality content.',
        author: '— DTC Brand Owner',
      },
    ].map((item, idx) => (
      <div
        key={idx}
        className='bg-[#111] text-white p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-[0_0_25px_#00ffcc] transition-all duration-300'
      >
        <p className='text-xl leading-relaxed italic mb-4'>“{item.quote}”</p>
        <p className='text-sm text-green-400 font-medium'>{item.author}</p>
      </div>
    ))}
  </div>
</section>

			<Devider />

			{/* Final CTA */}
			<section className='py-20 px-4 text-center bg-gradient-to-r from-black to-[#040014]'>
  <h2 className='text-4xl md:text-5xl font-bold mb-6 text-white transition-all duration-300 hover:tracking-wider'>
    Start your $199 Campaign Today
  </h2>
  <p className='text-xl md:text-2xl text-gray-300 mb-10'>
    Get 20+ creator-made videos — <span className='text-green-400 font-semibold'>quality guaranteed</span>.
  </p>

  <a
    href='mailto:info@matchably.kr'
    className='inline-block px-10 py-5 text-lg font-semibold rounded-xl bg-gradient-to-r from-green-400 to-blue-400 text-black shadow-xl transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_35px_#00ffff] hover:-translate-y-1'
  >
    📩 Start My Campaign
  </a>

  <p className='mt-6 text-gray-400 text-sm'>
    Or email us directly at <a href='mailto:info@matchably.kr' className='text-green-400 underline'>info@matchably.kr</a>
  </p>
</section>

		</div>
	);
};

export default BrandLandingPage;
