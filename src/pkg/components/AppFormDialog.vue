<script setup lang="ts">
import { inject } from "vue";
import type { AppFormProps } from '@/pkg/forms/types';
import AppForm from '@/pkg/forms/AppForm.vue';
import { useI18n } from 'vue-i18n';
import type { AppFormDialogProps } from "../types/types";
const { t } = useI18n()
const props = defineProps<AppFormDialogProps>();

// const props = defineProps<TableHeaderProps>();
const dialogRef = inject("dialogRef") as any;
const close = (e: any) => {
    dialogRef.value.close({
      success : true
    });
};

const formProps: AppFormProps<any, any> = {
    context: {
        title: props.title,
        options: {
            isBulkCreateHidden: true,
            isHeaderSubmitHidden: true,
            isFormTransparent: true,
        },
        submitHandler: {
            ...props.handlers.submitHandler,
            callback : () => {
                close({});
            }
        },
        findHandler : props.handlers.findHandler,
        sections: props.sections
    }
}
console.log(props);

</script>

<template>
    <div class="form-dialog">
        <Suspense timeout="0">
            <template #default>
                <app-form :context="formProps.context" />
            </template>
            <template #fallback>
                <div class="loading">
                    loading
                </div>
            </template>
        </Suspense>
    </div>
</template>
