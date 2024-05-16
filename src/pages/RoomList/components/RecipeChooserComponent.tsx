import { useEffect, useState } from "react";
import { Recipe } from "../../../types";
import "./RecipeChooserComponent.css";
import framesvg from "../../../assets/images/recipes/Frame1.svg";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import closeIcon from "../../../assets/images/closeIcon.webp";
import { getURL } from "../../../utils";

interface Props {
    recipe: Recipe | null;
    setRecipe: (_: Recipe) => void;
    goBack: () => void;
}

export const RecipeChooserComponent = ({
    recipe,
    setRecipe,
    goBack,
}: Props) => {
    const [recipeList, setRecipeList] = useState([] as Recipe[]);
    const [error, setError] = useState("");

    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 7,
        },
        mediumDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 3000, min: 2000 },
            items: 6,
        },
        desktop: {
            breakpoint: { max: 2000, min: 1024 },
            items: 5,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    };

    const getRecipesList = () => {
        fetch("http://127.0.0.1:8080/recipes")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch recipes");
                }
                return response.json();
            })
            .then((data) => {
                const parsed = JSON.parse(data) as Recipe[];
                setRecipeList(parsed);
                console.log(parsed);
            })
            .catch((error) => {
                console.error("Error fetching recipes:", error);
                setError("Failed to fetch recipes");
            });
    };

    useEffect(() => {
        getRecipesList();
    }, []);

    const handleRecipeChoose = (r: Recipe) => {
        if (!r.available) return;
        setRecipe(r);
    };

    return (
        <div className="container">
            {error && <div className="error">{error}</div>}
            <h2 className="bold">
                <img
                    src={closeIcon}
                    alt="close"
                    className="icons-close clickable"
                    onClick={goBack}
                    id="close-recipe-chooser"
                    draggable="false"
                />
                CHOOSE YOUR <span className="exploding-text">RECIPE</span>
            </h2>

            {recipeList?.length && (
                <Carousel responsive={responsive} className="carrousel">
                    {recipeList.map((r) => (
                        <div
                            key={r.name}
                            className={
                                "fit " + (recipe?.name === r.name ? "glow" : "")
                            }
                        >
                            <div
                                className={"recipe-card"}
                                onClick={() => {
                                    handleRecipeChoose(r);
                                }}
                            >
                                <img
                                    src={getURL("recipes/", r.name, ".png")}
                                    alt=""
                                    className={
                                        "recipe-face " +
                                        (r.available ? "pointer" : "grey")
                                    }
                                    draggable="false"
                                />
                            </div>
                        </div>
                    ))}
                </Carousel>
            )}
            <div className="ingredients-card">
                {recipe ? (
                    <div className="ingredients">
                        {recipe.cards.map(([card, num]) => (
                            <div>
                                {num} x {card.name}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="ingredients">
                        Click on a recipe to show ingredients
                    </div>
                )}
                <img src={framesvg} alt="" className="recipe-unfolded" />
            </div>
        </div>
    );
};
