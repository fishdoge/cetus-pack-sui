import Link from 'next/link'

export default async function Page() {
  return (
      <div>
        <div>
          Hi, this is monster page
        </div>
        <div>
          {[1, 2, 3].map((id) => (
            <button key={id} type="button" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              <Link href={`/monster/${id}`}>Monster {id}</Link>
            </button>
          )).map((button, i) => (
            <div key={i} className="py-1">
              {button}
            </div>
          ))}
        </div>
      </div>
  );
}