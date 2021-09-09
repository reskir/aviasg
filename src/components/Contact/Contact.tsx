import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { addContact, IContact } from '../../slices/main';
import { useAppDispatch, useAppSelector } from '../../store';

import styles from './Contact.module.scss';

const Contact = () => {
    const history = useHistory();
    const {
        main: { contact },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    const onSubmit = (data: IContact) => {
        dispatch(addContact(data));
        history.push('/checkout');
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.inputElement}>
                <label htmlFor="firstName">First name</label>
                <input
                    {...register('firstName', {
                        required: 'First name is required',
                        pattern: {
                            value: /[A-Za-z]/,
                            message: 'Only letters allowed',
                        },
                    })}
                    id="firstName"
                    defaultValue={contact?.firstName}
                    type="text"
                    placeholder="name"
                />
                {errors.firstName && (
                    <span className={styles.error}>
                        {errors.firstName.message}
                    </span>
                )}
            </div>
            <div className={styles.inputElement}>
                <label htmlFor="lastName">Last name</label>
                <input
                    {...register('lastName', {
                        required: 'Last name is required',
                        pattern: {
                            value: /[A-Za-z]/,
                            message: 'Only letters allowed',
                        },
                    })}
                    id="lastName"
                    defaultValue={contact?.lastName}
                    type="text"
                    placeholder="surname"
                />
                {errors.lastName && (
                    <span className={styles.error}>
                        {errors.lastName.message}
                    </span>
                )}
            </div>
            <div className={styles.inputElement}>
                <label htmlFor="email">Email</label>
                <input
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message:
                                'Entered value does not match email format',
                        },
                    })}
                    id="email"
                    defaultValue={contact?.email}
                    type="text"
                    placeholder="email"
                />
                {errors.email && (
                    <span className={styles.error}>{errors.email.message}</span>
                )}
            </div>

            <input type="submit" />
        </form>
    );
};

export default Contact;
