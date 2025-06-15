import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenericForm from '../../components/GenericForm/GenericForm';
import {
    fetchCustomerById,
    createCustomer,
    updateCustomer
} from '../../api/Customer/apiCustomer';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';
import Toast from '../../components/Toast/Toast';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useHttp } from '../../hooks/useHttp';
import Spinner from '../../components/Spinner/Spinner';

export default function CustomerFormPage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = Translations[language];

    const { request, loading, error } = useHttp();

    const [initialData, setInitialData] = useState({});
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (id) {
            fetchCustomerById(id, request).then(setInitialData);
        }
    }, [id, request]);

    const entityName = t.customer || 'Customer';
    const gender = t.customerGender || 'o';

    const getGenderedVerb = (baseVerb) => `${baseVerb}${gender}`;

    const getMessage = (template, verb) =>
        template.replace('%s', entityName).replace('%v', verb);

    function normalizeNestedFields(formData) {
        const result = {};

        Object.entries(formData).forEach(([key, value]) => {
            if (key.includes('.')) {
                const [parent, child] = key.split('.');
                if (!result[parent]) result[parent] = {};
                result[parent][child] = value;
            } else {
                result[key] = value;
            }
        });

        return result;
    }

    const handleSubmit = async (formData) => {
        try {
            const normalizedData = normalizeNestedFields(formData);
            let verb, message;

            if (id) {
                await updateCustomer(id, normalizedData, request);
                verb = getGenderedVerb('actualizad');
                message = getMessage(t.updatedSuccessfully, verb);
            } else {
                await createCustomer(normalizedData, request);
                verb = getGenderedVerb('cread');
                message = getMessage(t.createdSuccessfully, verb);
            }

            setToast({ message, type: 'success' });

            setTimeout(() => {
                navigate('/customers', {
                    state: { toast: { message, type: 'success' } }
                });
            }, 1000);

        } catch (error) {
            console.error('Error al guardar el cliente:', error);
            setToast({
                message: t.errorSavingItem.replace('%s', entityName.toLowerCase()),
                type: 'error'
            });
        }
    };

    const fields = [
        {
            name: 'firstName',
            label: t.firstName,
            type: 'text',
            placeholder: t.enterFirstName,
            required: true
        },
        {
            name: 'lastName',
            label: t.lastName,
            type: 'text',
            placeholder: t.enterLastName,
            required: true
        },
        {
            name: 'email',
            label: t.email,
            type: 'email',
            placeholder: t.enterEmail,
            required: true
        },
        {
            name: 'address.street',
            label: t.street,
            type: 'text',
            placeholder: t.enterStreet
        },
        {
            name: 'address.houseNumber',
            label: t.houseNumber,
            type: 'text',
            placeholder: t.enterHouseNumber
        },
        {
            name: 'address.zipCode',
            label: t.zipCode,
            type: 'text',
            placeholder: t.enterZipCode
        }
    ];

    return (
        <>
            <Breadcrumb
                paths={[
                    { label: t.home, to: '/' },
                    { label: t.customers, to: '/customers' },
                    { label: t.formCustomer }
                ]}
            />
            {loading && <Spinner />}

            {!loading && error && (
                <div className="error-message">
                    {t.errorLoadingProducts || 'Error loading products'}
                </div>
            )}

            {!loading && !error && (
                <GenericForm
                    title={id ? t.editCustomer : t.createCustomer}
                    fields={fields}
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    submitLabel={id ? t.saveChanges : t.create}
                />
            )}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}