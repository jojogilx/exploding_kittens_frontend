import useSound from "../useSound";

type Props = {
    disabled?: boolean;
    onClick: () => void;
    name: string;
    className?: string;
    id?: string;
    soundName: string;
};

export const ButtonWithSound = ({
    disabled,
    onClick,
    name,
    className,
    soundName,
    id,
}: Props) => {
    const clickSound = useSound(soundName);

    const handleClick = () => {
        clickSound.play();
        onClick();
    };

    return (
        <button
            className={`${className}`}
            id={id}
            disabled={disabled}
            onClick={handleClick}
        >
            {name}
        </button>
    );
};
