import { Pressable, type PressableProps, StyleSheet } from "react-native";

import { sizes, useTheme } from "@/theme";

import { Typography } from "./Typography";

type PrimaryButtonProps = PressableProps & {
    children: React.ReactNode;
};

function Button(props: PrimaryButtonProps) {
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
}

const style = StyleSheet.create({
    button: {
        width: "20%",
        justifyContent: "center",
        alignItems: "center",
        padding: sizes.spacing.sm,
        borderRadius: sizes.radius.md,
    },
});

export { Button };
