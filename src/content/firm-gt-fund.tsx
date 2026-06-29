import Image from "next/image";

export const firmGtFundPost = {
  slug: "firm-gt-fund",
  title: "Firm > Fund",
  author: "G. Todd Silva",
  excerpt:
    "I believe that most investors are running funds, and very few people are building firms. What do I mean by that? A fund, by my definition, has a single objective function: “how do I generate the most carry with the fewest people in the shortest amount of time?” Whereas a firm, in my definition, has two objectives. One is delivering exceptional returns, but the second is equally interesting: “How do I build a source of compounding competitive advantage?”",
} as const;

const paragraphClass =
  "mb-6 text-lg leading-relaxed text-[var(--color-muted)]";

export function FirmGtFundBody() {
  return (
    <>
      <p className={paragraphClass}>
        I believe that most investors are running <strong>funds</strong>, and
        very few people are building <strong>firms</strong>. What do I mean by
        that? A fund, by my definition, has a single objective function:
        &ldquo;how do I generate the most carry with the fewest people in the
        shortest amount of time?&rdquo; Whereas a firm, in my definition, has two
        objectives. One is delivering exceptional returns, but the second is
        equally interesting: &ldquo;How do I build a source of compounding
        competitive advantage?&rdquo;
      </p>

      <div className="mb-6 overflow-hidden rounded-lg">
        <Image
          src="/assets/blog/firm-gt-fund.webp"
          alt="Firm > Fund by David Haber"
          width={1024}
          height={447}
          className="h-auto w-full"
          priority
        />
      </div>

      <p className={paragraphClass}>
        Funds get more fragile with scale. So building competitive advantage
        becomes existential if you want to build an institution that endures. The
        problem is, that isn&apos;t how fund managers are encouraged to spend
        their time or their focus. Most funds are run by an alpha decision maker
        who oversees all investments. They spend most of their time thinking
        about the next marginal deal, and not much time thinking about their
        moats. Compensation structures reward investment returns, split among
        small teams.
      </p>

      <p className={paragraphClass}>
        Firms, on the other hand, are run by entrepreneurs. And entrepreneurs
        think constantly about competitive advantage. Many of the world&apos;s
        great enduring financial institutions think this way. Apollo thinks a lot
        about compounding competitive advantage, with their permanent capital
        structures. Goldman Sachs has a compounding competitive advantage with
        the embedded distribution of their wealth management division, who can
        fill a new fund instantly. Firms like Renaissance Technologies, D.E.
        Shaw, and Two Sigma invested a lot into technology and data to give them
        an edge. Firms are <em>product companies </em> in this way: they have to
        build a product that wins in the market, that is defensible and
        isn&apos;t obvious.
      </p>

      <p className={paragraphClass}>
        Firms also have more decentralized decision-making structures than funds.
        This is both by design (to build a 100-year compounding machine, you need
        a deep bench of leaders who you can trust with big decisions), and by
        necessity (because the CEO&apos;s focus is on{" "}
        <em>building a business, </em> not on the next marginal investment.) When
        your competitive advantage is constantly changing, there&apos;s a
        positive-sum project to work on (building and re-building your moat)
        that helps a loosely coupled org stay organized and aligned.
      </p>

      <p className={paragraphClass}>
        Venture Capital is almost always run in the &ldquo;fund&rdquo; model,
        with a small number of investors and often a single &ldquo;alpha&rdquo;
        decision maker. The fund spends its time thinking about its investments,
        since competitive advantage has historically been all about brand and
        reputation, which comes from the &ldquo;human network effect&rdquo; of
        backing great founders and returning legendary funds.
      </p>

      <p className={paragraphClass}>
        But since day 1 of Andreessen Horowitz, Marc and Ben have thought about
        VC as a <em>product for entrepreneurs</em>, rather than as a fund to
        manage. And so they&apos;ve built a16z much more like a <em>firm</em>{" "}
        that builds products, decentralizes its decision-making, and thinks
        obsessively about new sources of competitive advantage. This gives a16z
        some unique characteristics:
      </p>

      <ol className="mb-6 list-decimal space-y-4 pl-6 text-lg leading-relaxed text-[var(--color-muted)]">
        <li>
          We have entrepreneurs like Alex Rampell, Martin Casado, David Ulevitch
          and Chris Dixon leading their investment areas who you&apos;d have a{" "}
          <em>really</em> hard time recruiting into a traditional fund model to
          work for someone else. Marc &amp; Ben aren&apos;t approving their
          investment decisions; they&apos;re busy running the firm, so those
          leaders get genuine autonomy to make investments and build their
          teams. They get their own P&amp;L, their paintbrush to paint a
          masterpiece, and the entrepreneurial freedom to shape their products to
          best serve their customers (entrepreneurs).
        </li>
        <li>
          We&apos;ve invested a huge amount into &ldquo;platform&rdquo;, which is
          a <em>product for founders</em> to accelerate their hiring, marketing,
          sales, and more. This is our war machine that we put to work on behalf
          of our founders, to use our scale to tilt the board in their favor.
          This platform costs hundreds of millions of dollars a year in expenses;
          it&apos;s not cheap. But we do it because it&apos;s a source of durable
          competitive advantage that a &ldquo;fund&rdquo; could never justify
          making. (Many of our competitors talk about their &ldquo;platform
          team&rdquo;, but they often mean the two people doing recruiting, and
          a marketer. We have 400 people who spend all day helping companies
          win. These are not the same!)
        </li>
        <li>
          Therefore, because the firm is full of entrepreneurs and resources and
          product leverage, we can react quickly and decisively when a new
          opportunity comes up to build competitive advantage, while still
          enjoying our compounding economics of scale. Everyone at the firm is
          focused on <em>their contribution to the product</em>, not just their
          share of the returns.
        </li>
      </ol>

      <p className={paragraphClass}>
        This is the kind of vehicle you want to build, if you want your
        institution to last 100 years.
      </p>
    </>
  );
}
