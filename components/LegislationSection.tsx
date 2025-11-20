"use client";

import { motion } from "framer-motion";

export default function LegislationSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            HOW WILL NEW LEGISLATION AND INTEREST RATES AFFECT ME?
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Right now, in 2023, interest rates have increased compared to 2022. Much faster than any other rate increase with the reserve bank over the last ten years. The New Zealand Government is trying to take the heat out of the market by introducing new legislation.
            </p>

            <p>
              The only way to see what your house would sell for is to use a licensed Real Estate Agent. The report you will receive from our specialists will include a market commentary on what is happening in your location.
            </p>

            <p className="font-semibold">
              Remember, the market valuation is what buyers will be willing to pay for the home.
            </p>

            <p>
              This might be vastly different from the amount you thought. Just because you put thousands of dollars into the home repairing or renovating doesn't mean you'll see a dollar-for-dollar return on your investment. The ancient old saying 'it's worth what someone will pay' remains true today. Nothing has changed. Only external influences can affect that demand.
            </p>

            <p>
              So, before you list or sell your property, fill in the questionnaire and see what your place could sell for, and we will send your details out to the top agent in your location to give you an idea of market valuation. Most market valuations or appraisals can be done via phone or email. For a more accurate appraisal, we would always recommend an onsite visit.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
