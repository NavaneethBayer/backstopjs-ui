// import { tests } from "../jsonReport.json";
import { websites } from "../website-config";

function getReportUrl(website){
  return website;
}

export default function Home() {
  return (
    <main className="grid gap-x-40 gap-y-20 grid-cols-4 p-24">
      <div className="col-span-4">
        <h2 className="text-3xl font-bold leading-7 text-gray-900">
          Visual Testing
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          using{" "}
          <a
            className="text-orange-500"
            href="https://github.com/garris/BackstopJS"
            target="_blank"
          >
            BackstopJS
          </a>
        </p>
      </div>

      <div className="col-span-4">
        <div className="grid grid-cols-4 gap-x-6 gap-y-8">
          {websites.map((website) => (
            <div key={website.domain}>
              <div>
                <p className="block text-xl font-medium leading-6 text-gray-900">
                  Reference Domain
                </p>
                <p className="block text-sm  leading-6 text-gray-500">
                  {website.referenceDomain}
                </p>
              </div>
              <div className="mt-6">
                <p className="block text-xl font-medium leading-6 text-gray-900">
                  Testing Domain
                </p>
                <p className="block text-sm  leading-6 text-gray-500">
                  {website.domain}
                </p>
              </div>

              <div className="mt-20">
                <h4 className="text-xl font-medium">
                  Found total of <span className="font-bold">3000</span> pages
                </h4>
              </div>
              <div>
                <a
                  href={`/public/${website.name}/report/index.html`}
                  className="inline-block my-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  View Report
                </a>
              </div>
              <div />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
