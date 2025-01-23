import { Box, Button } from "@mui/material"
import CardGrid from "../../../components/CardGrid";
import { Tree } from "../../../types/tree";

interface CSRTreesCards {
    trees: Tree[]
    loading?: boolean
    hasMore?: boolean
    loadMoreTrees?: () => void
}


const CSRTreesCards: React.FC<CSRTreesCards> = ({ trees, loading, hasMore, loadMoreTrees }) => {

    return (
        <Box>
            <CardGrid
                loading={loading}
                cards={Object.values(trees).map((tree: any) => {
                    let location: string = ''
                    const { hostname, host } = window.location;
                    if (hostname === "localhost" || hostname === "127.0.0.1") {
                        location = "http://" + host + "/profile/" + tree.sapling_id
                    } else {
                        location = "https://" + hostname + "/profile/" + tree.sapling_id
                    }

                    return {
                        id: tree.id,
                        name: tree.assigned_to_name,
                        type: tree.plant_type,
                        dashboardLink: location,
                        image: tree.illustration_s3_path
                            ? tree.illustration_s3_path
                            : tree.image,
                    }
                })}
            />
            {hasMore && loadMoreTrees && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={loadMoreTrees}
                >
                    Load More Trees
                </Button>
            </div>}
        </Box>
    )
}

export default CSRTreesCards;