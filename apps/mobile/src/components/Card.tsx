import {
    type TextStyle,
    View,
    type ViewProps,
    type ViewStyle,
} from "react-native";

import { sizes, useTheme } from "@/theme";

import { Typography, type TypographyProps } from "./Typography";

type CardTextProps = TypographyProps;
type CardProps = ViewProps;

const CardText = (props: CardTextProps) => {
    const { colors } = useTheme();

    const style: TextStyle = {
        color: colors.card_foreground,
    };

    return (
        <Typography {...props} style={[style, props.style]}>
            {props.children}
        </Typography>
    );
};

const Card = (props: CardProps) => {
    const { colors } = useTheme();

    const style: ViewStyle = {
        backgroundColor: colors.card,
        padding: sizes.spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: sizes.radius.lg,
    };

    return (
        <View {...props} style={[style, props.style]}>
            {props.children}
        </View>
    );
};

export { Card, CardText };
export type { CardProps, CardTextProps };
