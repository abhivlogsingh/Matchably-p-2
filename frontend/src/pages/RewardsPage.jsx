/** @format */

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const RewardsPage = () => {
  return (
    <div className='bg-black text-white'>
      {/* SEO */}
      <Helmet>
        <title>Matchably</title>
        <meta
          name='description'
          content='Earn points for every approved post, invite friends, and redeem rewards like Amazon gift cards. Start earning with Matchably today!'
        />
        <meta property='og:title' content='Earn Rewards with Matchably' />
        <meta property='og:description' content='Get rewarded for content creation and referrals. Join Matchably now!' />
      </Helmet>

      {/* Hero Section */}
      <section className='text-center py-24 md:py-32 px-4'>
        <div className='max-w-6xl mx-auto'>
          <h1 className='text-4xl md:text-6xl font-extrabold mb-6 leading-tight'>
            Earn Points. Redeem Gift Cards. Invite Friends.
          </h1>
          <p className='text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto'>
            Turn every approved post into rewards — like Amazon gift cards — and help your friends do the same.
          </p>
          <Link
            to='/campaigns'
            className='inline-block px-10 py-5 text-lg font-semibold rounded-xl bg-gradient-to-r from-green-400 to-blue-400 text-black transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_30px_#00ffcc]'
          >
            🎯 Start Earning Now
          </Link>
          {/* <p className='mt-6 text-sm text-gray-400'>
            🎁 Creators redeemed over <span className='text-green-400 font-semibold'>$1,200</span> last month — 100P ≈ $5 value.
          </p> */}
        </div>
      </section>

      {/* How It Works */}
      <section className='py-24 px-4 border-t border-gray-800'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold text-center mb-16'>How It Works</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
            {[
              { icon: '📸', title: 'Upload Content', desc: 'Apply and submit real content' },
              { icon: '🎯', title: 'Get Approved', desc: 'Earn +100 P per post' },
              { icon: '💳', title: 'Redeem Rewards', desc: 'Convert to Amazon gift cards (delivered within 48h)' },
            ].map((step, index) => (
              <div
                key={index}
                className='p-8 bg-[#111] rounded-xl border border-gray-700 hover:border-blue-400 shadow-lg hover:shadow-blue-500/30 text-center transition-all duration-300 hover:scale-105'
              >
                <div className='text-5xl mb-4'>{step.icon}</div>
                <h3 className='text-xl font-semibold text-green-400 mb-2'>{step.title}</h3>
                <p className='text-gray-300'>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Rewards */}
      <section className='py-24 px-4 border-t border-gray-800'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-6'>Content Rewards</h2>
          <p className='text-center text-gray-400 mb-8'>
            Earn points for every approved post. Unlock rewards fast!
          </p>
          <div className='overflow-x-auto'>
            <table className='w-full text-center border border-gray-700 rounded-lg'>
              <thead className='bg-[#121212] text-gray-300'>
                <tr>
                  <th className='py-3 px-6 border-b border-gray-700'>Action</th>
                  <th className='py-3 px-6 border-b border-gray-700'>Points</th>
                </tr>
              </thead>
              <tbody>
                <tr className='border-b border-gray-700'>
                  <td className='py-4 px-6'>Post Approved</td>
                  <td className='py-4 px-6 text-green-400 font-semibold'>+100 P</td>
                </tr>
              </tbody>
            </table>
            <p className='text-sm text-gray-400 mt-4 text-center'>
              💡 Tip: Every 100P is roughly equal to $5 in gift cards.
            </p>
          </div>
        </div>
      </section>

      {/* Referral Rewards */}
      <section className='py-24 px-4 border-t border-gray-800'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-6'>Referral Rewards</h2>
          <p className='text-center text-gray-400 mb-8'>
            Earn points when your friends join and post using your referral ID.
          </p>
          <div className='overflow-x-auto'>
            <table className='w-full text-center border border-gray-700 rounded-lg'>
              <thead className='bg-[#121212] text-gray-300'>
                <tr>
                  <th className='py-3 px-4 border-b border-gray-700'>Referrals</th>
                  <th className='py-3 px-4 border-b border-gray-700'>You Earn</th>
                  <th className='py-3 px-4 border-b border-gray-700'>Friend Earns</th>
                </tr>
              </thead>
              <tbody>
                <tr className='border-b border-gray-700'>
                  <td className='py-4'>1</td>
                  <td className='text-green-400'>+50 P</td>
                  <td className='text-green-400'>+50 P</td>
                </tr>
                <tr className='border-b border-gray-700'>
                  <td className='py-4'>2–3</td>
                  <td className='text-green-400'>+50 P each</td>
                  <td className='text-green-400'>+50 P each</td>
                </tr>
                <tr>
                  <td className='py-4'>Cap</td>
                  <td className='text-red-400 font-semibold'>150 P max</td>
                  <td className='text-gray-400'>—</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className='text-sm text-gray-400 mt-6 text-center max-w-xl mx-auto'>
            A referral is valid only after your Matchably ID is entered during sign-up and the friend’s first post is approved.
          </p>
        </div>
      </section>

      {/* Points-for-Rewards Table */}
      <section className='py-24 px-4 border-t border-gray-800'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-6'>Redeemable Rewards</h2>
          <p className='text-center text-gray-400 mb-8'>
            The more points you earn, the bigger the reward. Redeem for Amazon e-Gift Cards in the U.S.
          </p>
          <div className='overflow-x-auto'>
            <table className='w-full text-center border border-gray-700 rounded-lg'>
              <thead className='bg-[#121212] text-gray-300'>
                <tr>
                  <th className='py-3 px-6 border-b border-gray-700'>Points</th>
                  <th className='py-3 px-6 border-b border-gray-700'>Reward</th>
                  <th className='py-3 px-6 border-b border-gray-700'>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr className='border-b border-gray-700'>
                  <td className='py-4 px-6'>500 P</td>
                  <td className='py-4 px-6 text-green-400 font-semibold'>$20 Amazon e-Gift Card</td>
                  <td className='py-4 px-6 text-gray-400'>Minimum redemption level</td>
                </tr>
                <tr className='border-b border-gray-700'>
                  <td className='py-4 px-6'>1,000 P</td>
                  <td className='py-4 px-6 text-green-400 font-semibold'>$40 Amazon e-Gift Card</td>
                  <td className='py-4 px-6 text-gray-400'>Double the rewards, double the fun</td>
                </tr>
                <tr className='border-b border-gray-700'>
                  <td className='py-4 px-6'>2,000 P</td>
                  <td className='py-4 px-6 text-green-400 font-semibold'>$90 Amazon e-Gift Card</td>
                  <td className='py-4 px-6 text-gray-400'>+ Bonus included</td>
                </tr>
                <tr>
                  <td className='py-4 px-6'>3,000 P</td>
                  <td className='py-4 px-6 text-green-400 font-semibold'>$120 Amazon e-Gift Card</td>
                  <td className='py-4 px-6 text-gray-400'>Best value tier</td>
                </tr>
              </tbody>
            </table>
            <p className='text-sm text-gray-400 mt-4 text-center'>
              🚀 Tip: Redeem anytime once you hit a reward tier. No expiration on earned points.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='py-24 px-4 border-t border-gray-800'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12'>Frequently Asked Questions</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {[
              ['Where can I check my points?', 'Go to My Page → Rewards for balance and activity.'],
              ['Why didn’t I get referral points?', 'Your friend must enter your ID and have an approved post.'],
              ['How long does approval take?', '1–2 business days.'],
              ['How do I redeem?', 'Once you hit 500 Points (≈ $20), the button unlocks. You’ll receive your Amazon gift code within 48h via email.'],
            ].map(([question, answer], i) => (
              <div
                key={i}
                className='p-6 bg-[#111] rounded-xl border border-gray-700 shadow-md hover:shadow-blue-500/30 hover:border-blue-400 transition-all duration-300'
              >
                <h3 className='text-lg font-semibold text-green-400 mb-2'>❓ {question}</h3>
                <p className='text-sm text-gray-300'>{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className='py-20 px-4 border-t border-gray-800 text-center'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold mb-6 transition-all hover:tracking-wider'>
            Ready to turn content into rewards?
          </h2>
          <Link
            to='/campaigns'
            className='inline-block px-10 py-5 text-lg font-semibold rounded-xl bg-gradient-to-r from-green-400 to-blue-400 text-black shadow-xl transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_35px_#00ffff]'
          >
            📩 Apply Now
          </Link>
          <p className='mt-4 text-sm text-gray-400'>
            Or <Link to='/campaigns' className='text-blue-400 underline'>see current campaigns</Link>
          </p>
          <p className='mt-2 text-xs text-gray-500'>✅ Rewards are currently issued as Amazon e-Gift Cards.</p>
        </div>
      </section>
    </div>
  );
};

export default RewardsPage;
