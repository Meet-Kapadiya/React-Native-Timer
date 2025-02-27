import React, {memo, useCallback} from 'react';
import {useForm} from 'react-hook-form';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import InputSelect from '../../../components/InputSelect';
import {AppConstants} from '../../../constants';
import {addTimer, TimersState} from '../../../redux/Timers';
import {Category, StoreDispatch} from '../../../redux/store.types';
import {rSize} from '../../../utils/responsive';
import {showToast} from '../../../../App';

type TimerFields = {
  name: string;
  duration: number;
  category: Category | string;
};

const Home = () => {
  const {
    control,
    formState: {errors},
    handleSubmit,
    reset,
  } = useForm<TimerFields>({
    mode: 'onChange',
    reValidateMode: 'onSubmit',
  });
  const dispatch = useDispatch<StoreDispatch>();
  const categories = useSelector(TimersState);

  const submitHandler = useCallback(
    (data: TimerFields) => {
      Keyboard.dismiss();
      const timer = {
        name: data?.name?.trim(),
        duration: Number(data?.duration),
        timeLeft: Number(data?.duration),
        running: false,
      };
      dispatch(
        addTimer({
          category:
            typeof data?.category === 'object'
              ? data?.category?.name
              : data?.category?.trim(),
          timer,
        }),
      );
      reset();
      showToast({message: 'Timer created successfully 🎉'});
    },
    [dispatch, reset],
  );

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={AppConstants.isIOS ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.contentCont}
        keyboardShouldPersistTaps={'handled'}>
        <View>
          <Input
            control={control}
            name="name"
            placeholder="Enter Name"
            errorMessage={errors?.name?.message}
            style={styles.input}
          />
          <Input
            control={control}
            name="duration"
            placeholder="Enter Duration"
            errorMessage={errors?.duration?.message}
            style={styles.input}
            inputConfig={{
              keyboardType: 'number-pad',
            }}
          />
          <InputSelect
            control={control}
            name="category"
            placeholder="Enter Category"
            errorMessage={errors?.category?.message}
            style={styles.input}
            data={categories}
            labelField="name"
          />
          <Button label="Create" onPress={handleSubmit(submitHandler)} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default memo(Home);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  contentCont: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: rSize(20),
  },
  input: {
    marginBottom: rSize(28),
  },
});
