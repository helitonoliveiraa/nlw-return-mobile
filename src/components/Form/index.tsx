import { useState } from 'react';
import { ArrowLeft } from 'phosphor-react-native';
import { captureScreen } from "react-native-view-shot";
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';

import { theme } from '../../theme';
import { feedbackTypes } from '../../utils/feedbackTypes';
import { Button } from '../Button';
import { ScreenshotButton } from '../ScreenshotButton';
import { FeedbackType } from '../Widget';

import { styles } from './styles';
import { api } from '../../services/api';

type FormProps = {
  type: FeedbackType;
  onFeedbackCanceled: () => void;
  onFeedbackSent: () => void;
}

export function Form({ type, onFeedbackCanceled, onFeedbackSent }: FormProps) {
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const feedbackTypeInfo = feedbackTypes[type];

  function handleTakeScreenshot() {
    captureScreen({
      format: 'jpg',
      quality: 0.8,
    })
      .then(uri => setScreenshot(uri))
      .catch(err => console.log(err))
  }

  function handleRemoveScreenshot() {
    setScreenshot(null)
  }

  async function handleSubmitFeedback() {
    if (isSendingFeedback) {
      return;
    }

    setIsSendingFeedback(true);

    try {
      const screenshotBase64 = screenshot && await FileSystem.readAsStringAsync(screenshot, {
        encoding: 'base64'
      });

      console.log(screenshotBase64)

      await api.post('feedbacks', {
        type,
        screenshot: `data:image/png;base64,${screenshotBase64}`,
        comment,
      });

      setIsSendingFeedback(false);
      onFeedbackSent();
    } catch (err) {
      console.log({err});
      setIsSendingFeedback(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled}>
          <ArrowLeft 
            size={24}
            weight="bold"
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Image 
            source={feedbackTypeInfo.image}
            style={styles.image}
          />
          <Text style={styles.titleText}>
            {feedbackTypeInfo.title}
          </Text>
        </View>
      </View>

      <TextInput 
        multiline
        style={styles.input}
        placeholder="Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo..."
        placeholderTextColor={theme.colors.text_secondary}
        autoCorrect={false}
        onChangeText={setComment}
      />

      <View style={styles.footer}>
        <ScreenshotButton 
          onTakeShot={handleTakeScreenshot}
          onRemoveShot={handleRemoveScreenshot}
          screenshot={screenshot}
        />

        <Button 
          isLoading={isSendingFeedback} 
          onPress={handleSubmitFeedback}
        />
      </View>
    </View>
  )
}