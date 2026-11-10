import { Text, type TextProps } from "react-native";

import { sizes, useTheme } from "@/theme";

type TypographyProps = TextProps & {
    size?: keyof typeof sizes.typography;
};

const Typography = (props: TypographyProps) => {
    const { colors } = useTheme();

    return (
        <Text
            style={[
                {
                    fontSize: sizes.typography[props.size ?? "base"],
                    color: colors.foreground,
                },
                props.style,
            ]}
        >
            {props.children}
        </Text>
    );
};

export { Typography };
export type { TypographyProps };
