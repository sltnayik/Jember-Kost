import { getKostFilterOptions, getKosts } from "@/data/kosts";
import { KostListShell } from "@/components/user/kost-list-shell";

interface KostPageProps {
  searchParams: Promise<{
    query?: string;
    campusId?: string;
    district?: string;
    gender?: string;
    facilityId?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function KostPage({ searchParams }: KostPageProps) {
  const params = await searchParams;
  const [result, filterOptions] = await Promise.all([
    getKosts({
      query: params.query,
      campusId: params.campusId,
      district: params.district,
      genderType: params.gender as "putra" | "putri" | "campur" | undefined,
      facilityId: params.facilityId,
      sort: params.sort as "latest" | "price_low" | "price_high" | "rating_high" | "nearby" | "name_asc" | undefined,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      status: params.status as "available" | "full" | undefined,
      page: params.page ? Number(params.page) : 1,
    }),
    getKostFilterOptions(),
  ]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <KostListShell
        initialKosts={result.data}
        initialCount={result.count}
        filterOptions={filterOptions}
        initialQuery={params.query ?? ""}
        initialCampusId={params.campusId ?? ""}
        initialDistrict={params.district ?? ""}
        initialGender={params.gender ?? ""}
        initialFacilityId={params.facilityId ?? ""}
        initialSort={params.sort ?? "latest"}
        initialMinPrice={params.minPrice ?? ""}
        initialMaxPrice={params.maxPrice ?? ""}
        initialStatus={params.status ?? ""}
        initialPage={params.page ? Number(params.page) : 1}
        initialPageCount={result.pageCount}
      />
    </main>
  );
}
