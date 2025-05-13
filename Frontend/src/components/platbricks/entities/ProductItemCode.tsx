import DisplayName from "components/platbricks/shared/DisplayName";
import useProductCache from "hooks/caches/useProductCache";
import { useEffect, useState } from "react";
import { guid } from "types/guid";

interface ProductItemCodeProps {
  productId?: string | guid | null;
  placeholder?: string;
}

const ProductItemCode = (props: ProductItemCodeProps) => {
  const [getProductById] = useProductCache();
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (props.productId) {
      const { itemCode } = getProductById(props.productId as guid);
      setDisplayText(itemCode);
    } else {
      setDisplayText(props.placeholder ? props.placeholder : "");
    }
  }, [props.productId, props.placeholder, getProductById]);

  return <DisplayName displayText={displayText} />;
};

export default ProductItemCode;
