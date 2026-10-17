import React, { useCallback, useEffect, useState } from "react";
import { Message } from "@/model/User.models";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptingMessage } from "@/schema/acceptMessegeSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
function page() {
  const [messages, setmessages] = useState<Message[]>([]);
  const [isloading, setLoading] = useState(false);
  const [isSwitching, setisSwitching] = useState(false);

  const hadledeleteMessage = (messageId: string) => {
    setmessages(
      messages.filter((message) => message._id.toString() !== messageId),
    );
  };
  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptingMessage),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("isAcceptingMessage");

  const fetchAcceptMesssage = useCallback(async () => {
    setisSwitching(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue(
        "isAcceptingMessage",
        response.data.isAcceptingMessages ?? false,
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("error", {
        description:
          axiosError.response?.data.message ||
          "failed to fetch message settings",
      });
    } finally {
      setisSwitching(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setLoading(true);
      setisSwitching(false);

      try {
        const response = await axios.get<ApiResponse>("/api/accept-messages");
        setmessages(response.data.messages || []);
        if (refresh) {
          toast("Refreshed Messages", {
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast("error", {
          description:
            axiosError.response?.data.message ||
            "failed to fetch message settings",
        });
      } finally {
        setLoading(false);
        setisSwitching(false);
      }
    },
    [setLoading, setmessages],
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMesssage();
  }, [session, fetchAcceptMesssage, fetchMessages, setValue]);
  //handle switch change
  const hadleSWitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("isAcceptingMessage", !acceptMessages);
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("error", {
        description:
          axiosError.response?.data.message ||
          "failed to fetch message settings",
      });
    }
  };
  if (!session || !session.user) {
    return <div>Please login</div>;
  }
  return <div>page</div>;
}

export default page;
