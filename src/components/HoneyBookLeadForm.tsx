import Image from "next/image";
import Script from "next/script";

const HONEYBOOK_ID = "6ae7d14e630dd01c554bf7c6";
const HONEYBOOK_FORM_URL =
  "https://eliteeventimages430496.hbportal.co/public/6af0ec92f243bb4d551456c7";

export default function HoneyBookLeadForm() {
  return (
    <>
      <Image
        src={`https://www.honeybook.com/p.png?pid=${HONEYBOOK_ID}`}
        alt=""
        width={1}
        height={1}
        aria-hidden="true"
        className="hidden"
        unoptimized
      />
      <div className={`hb-p-${HONEYBOOK_ID}-1`} />
      <Script id="honeybook-lead-form" strategy="afterInteractive">
        {`(function(h,b,s,n,i,p,e,t) {
  h._HB_ = h._HB_ || {};
  h._HB_.pid = i;
  t = b.createElement(s);
  t.type = "text/javascript";
  t.async = true;
  t.src = n;
  e = b.getElementsByTagName(s)[0];
  e.parentNode.insertBefore(t,e);
})(window,document,"script","https://widget.honeybook.com/assets_users_production/websiteplacements/placement-controller.min.js","${HONEYBOOK_ID}");`}
      </Script>
      <noscript>
        <a href={HONEYBOOK_FORM_URL} className="text-[#8B5CF6] underline">
          Open the inquiry form
        </a>
      </noscript>
    </>
  );
}
