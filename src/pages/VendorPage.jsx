// src/pages/VendorPage.jsx (Update useEffect to fetch Vendor Name)

// ... (existing imports)
import { doc, getDoc } from 'firebase/firestore'; // <-- NEW IMPORT

function VendorPage() {
  const { vendorId } = useParams();
  // ... (rest of cart/auth imports)
  
  const [products, setProducts] = useState([]);
  const [vendorEmail, setVendorEmail] = useState('Vendor'); // <-- Update state name
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vendorId) {
      setLoading(false);
      return;
    }
    
    // --- 1. Fetch Vendor Information ---
    const fetchVendorName = async () => {
      try {
        const userRef = doc(db, "users", vendorId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          // Display the email as the vendor name
          setVendorEmail(userSnap.data().email.split('@')[0]); 
        } else {
          setVendorEmail("Unknown Vendor");
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };
    
    fetchVendorName();
    
    // --- 2. Query Products (Existing Logic) ---
    const q = query(
      collection(db, "products"), 
      where("vendorId", "==", vendorId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsArray = [];
      snapshot.forEach((doc) => {
        productsArray.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productsArray);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching vendor products:", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [vendorId]);

  // ... (rest of component)

  return (
    <div style={{ padding: '20px' }}>
      <div className="card" style={{ maxWidth: '800px', margin: 'auto', marginBottom: '30px' }}>
        <h2>{vendorEmail}'s Marketplace</h2> {/* <-- USE vendorEmail HERE */}
        <p>Scanning the QR code brought you here! Shop this vendor's current items.</p>
      </div>
      {/* ... (rest of the product display remains the same) ... */}
    </div>
  );
}

export default VendorPage;