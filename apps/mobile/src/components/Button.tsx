import { Pressable, type PressableProps, StyleSheet } from "react-native";

import { Typography } from "./Typography";

import { sizes, useTheme } from "@/theme";

type PrimaryButtonProps = PressableProps & {
    children: React.ReactNode;
};

export const Button = (props: PrimaryButtonProps) => {
    const { colors } = useTheme();

    return (
        <Pressable
            {...props}
            style={[
                style.button,
                {
                    backgroundColor: colors.primary,
                },
            ]}
        >
            <Typography style={{ color: colors.background }} size="base">
                {props.children}
            </Typography>
        </Pressable>
    );
};

const style = StyleSheet.create({
    button: {
        width: "20%",
        justifyContent: "center",
        alignItems: "center",
        padding: sizes.spacing.sm,
        borderRadius: sizes.radius.md,
    },
});
