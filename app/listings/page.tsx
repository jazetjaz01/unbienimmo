// ⚠️ Important pour Next 16 + Turbopack
export const dynamic = "force-dynamic";

import { supabasePublic } from "@/lib/supabase/supabase-public";
import Link from "next/link";
import ListingMap from "@/components/ListingMap";

interface Listing {
  id: number;
  title: string;
  price: number;
  latitude: number;
  longitude: number;
}

export default async function ListingsPage() {
  // Récupération des annonces publiées via le client public Supabase
  const { data: listings, error } = await supabasePublic
    .from("listings")
    .select("id, title, price, latitude, longitude")
    .eq("is_published", true);

  if (error) {
    console.error("Erreur lors du chargement des annonces:", error);
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Erreur lors du chargement des annonces. Veuillez réessayer.
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Toutes les Annonces Publiées</h1>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Carte des biens</h2>
        <Link
          href="/create"
          style={{
            padding: "10px 15px",
            backgroundColor: "#0070f3",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          ➕ Créer une nouvelle annonce
        </Link>
      </div>

      {/* Carte interactive */}
      {listings && listings.length > 0 ? (
        <ListingMap listings={listings as Listing[]} />
      ) : (
        <p
          style={{
            textAlign: "center",
            padding: "50px",
            border: "1px solid #ccc",
          }}
        >
          Aucune annonce publiée n'a été trouvée pour le moment.
        </p>
      )}

      {/* Liste détaillée */}
      <div style={{ marginTop: "40px" }}>
        <h2>Liste détaillée</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {listings?.map((listing: Listing) => (
            <li
              key={listing.id}
              style={{ borderBottom: "1px solid #eee", padding: "15px 0" }}
            >
              <h3>{listing.title}</h3>
              <p>
                <strong>Prix :</strong> {listing.price} €
                <span style={{ marginLeft: "20px", color: "#666" }}>
                  (Localisation : Lat {listing.latitude}, Lon {listing.longitude})
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
