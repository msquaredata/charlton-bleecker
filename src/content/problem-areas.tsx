import Image from "next/image";
import { CALENDLY_URL, CONTACT_EMAIL } from "@/data/onePagerContent";

export const problemAreasPost = {
  slug: "blog-post-four-43xem",
  title:
    "10 problem areas that erode your business value…and how we'll fix them.",
  author: "G. Todd Silva",
  excerpt:
    "Our team has invested in hundreds of companies. We have observed countless problems which slowly (then quickly) erode the value you worked so hard to create. These are our top 10...",
} as const;

const paragraphClass =
  "mb-6 text-lg leading-relaxed text-[var(--color-muted)]";

const listClass =
  "mb-6 list-decimal space-y-6 pl-6 text-lg leading-relaxed text-[var(--color-muted)]";

const linkClass = "font-semibold text-[var(--color-accent)] hover:underline";

export function ProblemAreasBody() {
  return (
    <>
      <div className="mb-6 overflow-hidden rounded-lg">
        <Image
          src="/assets/blog/problem-areas-hero.jpg"
          alt="Man standing in front of window blinds"
          width={1500}
          height={1125}
          className="h-auto w-full"
          priority
        />
      </div>

      <p className={paragraphClass}>
        Our team has invested in hundreds of companies. We have observed
        countless problems which slowly (then quickly) erode the value you
        worked so hard to create.
      </p>

      <p className={paragraphClass}>These are our top 10...</p>

      <ol className={listClass}>
        <li>
          <strong>Crippling customer contracts: </strong> Most managements get
          excited about signing new customer contracts. Rightly so. Growth is the
          engine that creates value and keeps the team motivated. However, the
          devil lurks in the details. For example, how long does the customer
          have to pay you? If the term is long, you might not get the cash into
          your bank account fast enough to pay your own bills. Is there recourse
          if the customer doesn&apos;t pay you on time? We can help review,
          revise, and negotiate contract terms for a win-win outcome.
        </li>
        <li>
          <strong>Dusty A/R: </strong> Sometimes we consider customer receivables
          &ldquo;uncollectible.&rdquo; But are they? Maybe the customer is going
          through a rough patch, or a personnel change, or a personal life
          change. Can you work out a payment plan? What about swapping that asset
          for some equity in the customer? We can help you get the money or other
          value you already earned.
        </li>
        <li>
          <strong>Neglected A/P: </strong> We&apos;ve all been here...paying some
          vendors while selectively ignoring others, hoping the neglected ones
          don&apos;t call. But, 99% of the time, they will call you. If
          you&apos;re very late, you receive threats of demand letters or worse.
          So, do you have a counterproposal that you can live with? We can help
          craft that counter so both parties can re-start the relationship
          productively.
        </li>
        <li>
          <strong>Creeping G&amp;A: </strong> Your business was growing. Maybe even
          rapidly. So, you hired and then hired more. What was once a team you
          could manage directly soon required other managers. Lots of delegation
          to others and wondering what some team members did all day. You
          negotiated a new lease for more space to accommodate the growth. New
          expenses seem to pop-up on your bank statements – consultants, meals,
          travel, legal. We can develop a plan to reign in redundant costs and
          establish accountability across your company.
        </li>
        <li>
          <strong>A big supplier: </strong> You finally secured that critical
          supply contract. Maybe a component, maybe a service. Definitely
          critical. The relationship was smooth. Until you notice that the vendor
          is a little less responsive than 6 months ago. Is it me (&ldquo;I&apos;m
          now just a small customer&rdquo;) or is it them (&ldquo;they probably
          have their own financial problems&rdquo;). &ldquo;What if this trend
          continues,&rdquo; you wonder. We can get to the bottom of this so you
          don&apos;t have to initiate uncomfortable conversations, and then we
          can come up with a plan to fix it.
        </li>
        <li>
          <strong>A really big customer: </strong> I once worked at a company with
          one 80%+ customer. And that customer was a very large public company. We
          were small and private. Our sales team tried to sign new large
          customers...for growth and diversification. But, it takes a long time
          to successfully hunt big game. It&apos;s a delicate balancing act to
          keep that big guy in love with you and simultaneously play the field.
          But, it is an absolute necessity. The ultimate risk to your company
          are too great...retaining talent, attracting capital, getting a good
          night&apos;s sleep. We can help diversify your customer base to
          mitigate that looming risk.
        </li>
        <li>
          <strong>Negative culture: </strong> This one is hard to quantify but you
          know it when you live it. And it can be fatal. Hidden agendas,
          misaligned incentives, undermining behaviors, unwelcome extracurricular
          activities, low expectations, miscommunication or lack of
          communication. I&apos;m sure you could expand this list based on your
          own experiences. For now, let&apos;s just agree that a hard stop is
          needed to prevent the toxic culture from spreading. Then, you must
          assertively establish the rules of the road for the new (or once
          great) culture. We can help with the entire re-set process.
        </li>
        <li>
          <strong>Strained lender relations: </strong> Our bank fired us. It
          started slowly, but picked up steam with our eroding credit ratios,
          weekly meetings, and mutual frustration. Then they (it was a committee)
          fired us and I had to find a new, more expensive, credit solution. The
          thing with lenders (and bond investors) is that they are almost always
          right when it comes to assessing creditworthiness. Conservatism (and
          default risk) is in their DNA. Since you can&apos;t change DNA, you
          probably should have proactively kept the lines of communication wide
          open. That way borrower and lender can collaborate on solutions to fit
          the hopefully temporary challenges. We&apos;ve been there and can help
          you work with your current lender, find another one, or resolve this
          issue by other means so that you can focus on growing your business.
        </li>
        <li>
          <strong>Deficient shareholder communications: </strong> This one is a
          corollary to #8 above. Except often times, the investors are friends,
          family, and other high net worth individuals. Initially, you get them
          excited about your business idea. Then they become even more excited
          about the prospect for big returns via cash distributions and/or an
          exit. The financial model you confidently shared with them showed
          revenues and profits sloping steeply up and to the right. All models
          do. I&apos;ve seen and created hundreds. Then, it happens. The economy
          downshifts, a competitor acts &ldquo;irrational,&rdquo; cost of goods
          or services expanded faster than expected. Then it happened again.
          Tell your investors the good, the bad, and the ugly. Do not wait. We
          can help you craft the right messaging for your investors and also fix
          your problems to mitigate a repeat.
        </li>
        <li>
          <strong>Undercapitalization: </strong> I saved the best for last. Fact:
          Most companies like yours don&apos;t have enough capital to ride-out
          the unexpected twists and turns of running a business. It&apos;s not
          your fault. You raise what you need (or what you can) and not more.
          That way you prevent diluting investors (and yourself!) down too much.
          The challenge is in defining &ldquo;what you need.&rdquo; The hard truth
          is you should add &ldquo;and then some&rdquo; to that statement.
          Dilution is just a simple calculation...once you issue the shares, you
          can&apos;t change the math. But, you can affect the value per share
          owned by growing your business and operating it efficiently. We can
          help structure the right funding and let you focus on creating that
          value for all investors.
        </li>
      </ol>

      <p className={paragraphClass}>
        Most business problems don&apos;t show up overnight. They erode value
        quietly in the background until one day they break big. At Charlton
        Bleecker, we partner with business owners like you to take on these
        issues and create value. Schedule a free call with us by clicking{" "}
        <a
          href={CALENDLY_URL}
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </p>

      <h2 className="mb-4 font-display text-2xl font-semibold text-[var(--color-dark)]">
        About Us
      </h2>
      <p className={paragraphClass}>
        Charlton Bleecker Group LLC acquires and grows endurable scalable
        businesses. We partner with owners and managers to unlock value, fix
        hidden risks, and position companies for long-term success.
      </p>

      <p className={paragraphClass}>
        <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
          {CONTACT_EMAIL}
        </a>
      </p>
    </>
  );
}
