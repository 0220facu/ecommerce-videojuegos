import './ProductCard.css';
import { Box, Card, Inset, Text, Strong, Button } from "@radix-ui/themes";
import ImgTest from '../../Img/logo.png'
const ProductCard = () => {

    return (

            <Box maxWidth="240px">
                <Card size="2">
                    <Inset clip="padding-box" side="top" pb="current">
                        <img src={ImgTest} alt="Imagen producto" style={{
                            display: "block",
                            objectFit: 'contain',
                            width: "90%",
                            marginLeft: '5%',
                            height: 140
                        }} />
                    </Inset>
                    <Text as='h4' size="5">
                        Titulo de producto
                    </Text>
                    <br />
                    <Text as='h4' size="2">
                        Este es el detalle del producto
                    </Text>
                    <br />
                    <Text color="green" as='h4' size="3">
                        $200.000
                    </Text>
                    <br />
                    <Button className='button-buy' color="green" variant="soft">Comprar</Button>
                </Card>
            </Box>

    )
}

export default ProductCard;