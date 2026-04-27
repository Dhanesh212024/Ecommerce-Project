import { ProductProvider } from "./productcontext/productProvider";
import Router from "./router";
import { AuthProvider } from "./usercontext/context";

export default function App() {
  return (
    <>
      <AuthProvider>
        <ProductProvider>

        <Router />
        </ProductProvider>

      </AuthProvider>
    </>
  );
}
