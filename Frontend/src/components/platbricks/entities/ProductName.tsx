import DisplayName from "components/platbricks/shared/DisplayName";
import useProductCache from "hooks/caches/useProductCache";
import { useEffect, useState } from "react";
import { guid } from "types/guid";

interface ProductNameProps {
  productId?: string | guid | null;
  placeholder?: string;
}

const ProductName = (props: ProductNameProps) => {
  const [getProductById] = useProductCache();
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (props.productId) {
      const { name } = getProductById(props.productId as guid);
      setDisplayText(name);
    } else {
      setDisplayText(props.placeholder ? props.placeholder : "");
    }
  }, [props.productId, props.placeholder, getProductById]);

  return <DisplayName displayText={displayText} />;
};

export default ProductName;
